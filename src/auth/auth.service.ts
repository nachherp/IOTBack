import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async generateTwoFactorSecret(email: string) {
    const secret = speakeasy.generateSecret({ name: `YourAppName (${email})` });
    if (!email) {
      throw new Error('Email no puede ser nulo');
    }

    await this.prisma.administrador.update({
      where: { email },
      data: { twoFactorSecret: secret.base32 }
    });

    const qrCode = await qrcode.toDataURL(secret.otpauth_url);
    return qrCode;
  }

  async verifyTwoFactorCode(email: string, token: string): Promise<any> {
    const admin = await this.prisma.administrador.findUnique({ where: { email } });
    if (!admin) {
      console.error('Admin no encontrado para el email:', email);
      return { success: false, message: 'Admin no encontrado' };
    }
    if (!admin.twoFactorSecret) {
      console.error('No hay twoFactorSecret para el admin:', email);
      return { success: false, message: 'No hay twoFactorSecret' };
    }

    console.log('Verificando código con secret:', admin.twoFactorSecret);
    const isValid = speakeasy.totp.verify({
      secret: admin.twoFactorSecret,
      encoding: 'base32',
      token
    });

    if (isValid) {
      console.log('Código TOTP verificado correctamente');
      return { success: true };
    } else {
      console.error('Código TOTP inválido');
      return { success: false, message: 'Código TOTP inválido' };
    }
  }

  async register(email: string, password: string, nombre: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.administrador.create({
      data: {
        email,
        password: hashedPassword,
        nombre
      }
    });
    return newUser;
  }

  async login(email: string, password: string): Promise<any> {
    const admin = await this.prisma.administrador.findUnique({ where: { email } });
    
    if (admin && await bcrypt.compare(password, admin.password)) {
      const payload = { email: admin.email, sub: admin.id_admin };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken, message: 'Código 2FA enviado', userId: admin.id_admin };
    } else {
      throw new Error('Credenciales de inicio de sesión inválidas');
    }
  }

  async validateUser(email: string): Promise<any> {
    const admin = await this.prisma.administrador.findUnique({ where: { email } });

    if (admin) {
      return admin;
    }
    return null;
  }
}
