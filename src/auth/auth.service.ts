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

  async registerMiembro(email: string, password: string, nombre: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `IOT (${email})`,
      issuer: 'IOT'
    });

    // Buscar un equipo existente
    
    
    const newMiembroData: any = {
      email,
      password: hashedPassword,
      nombre,
      twoFactorSecret: secret.base32,
      telefono: null,
      rol: 'miembro', // Asignar el rol por defecto
      carga: null,
      edad: null,
    };
    
    

    const newMiembro = await this.prisma.miembro.create({
      data: newMiembroData
    });

    const otpAuthUrl = `otpauth://totp/YourAppName:${email}?secret=${secret.base32}&issuer=YourAppName`;

    return {
      message: 'Miembro registrado con éxito',
      user: this.serializeUser(newMiembro),
      twoFactorSecret: secret.base32,
      qrCode: await qrcode.toDataURL(otpAuthUrl),
    };
  }

  async login(email: string, password: string): Promise<any> {
    const miembro = await this.prisma.miembro.findFirst({ where: { email } });
    const admin = await this.prisma.administrador.findUnique({ where: { email } });

    let user = miembro || admin;
    let rol = user?.rol || (admin ? 'admin' : 'miembro'); // Ahora usa el rol de la DB

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas');
    }

    const token = await this.generateJwt(email, rol); // Generar JWT con rol

    return { message: 'Inicio de sesión exitoso', token, rol }; // Ahora enviamos "rol" correctamente
}


  async generateTwoFactorSecret(email: string) {
    const miembro = await this.prisma.miembro.findFirst({ where: { email: email } });
    if (!miembro) throw new Error('Usuario no encontrado');
    if (!miembro.twoFactorSecret) throw new Error('El usuario no tiene un secreto 2FA asignado.');

    const otpAuthUrl = `otpauth://totp/YourAppName:${email}?secret=${miembro.twoFactorSecret}&issuer=YourAppName`;
    return await qrcode.toDataURL(otpAuthUrl);
  }

  async verifyTwoFactorCode(email: string, token: string): Promise<any> {
    const miembro = await this.prisma.miembro.findFirst({ where: { email: email } });
    const admin = await this.prisma.administrador.findUnique({ where: { email: email } });
    let user = miembro || admin;

    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }
    if (!user.twoFactorSecret) {
      return { success: false, message: 'No tienes un secreto 2FA asignado.' };
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });

    return isValid ? { success: true } : { success: false, message: 'Código TOTP inválido' };
  }

  async generateJwt(email: string, role: string): Promise<string> {
    return this.jwtService.sign({ email, role });
  }

  async validateUser(email: string): Promise<any> {
    const miembro = await this.prisma.miembro.findFirst({ where: { email: email } });
    const admin = await this.prisma.administrador.findUnique({ where: { email: email } });
    return miembro || admin;
  }

  private serializeUser(user: any) {
    return {
      ...user,
      telefono: user.telefono ? user.telefono.toString() : user.telefono,
    };
  }
}
