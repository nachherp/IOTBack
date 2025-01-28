import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import * as speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<{ message: string }> {
    const admin = await this.prisma.administrador.findUnique({ where: { email } });

    if (!admin || admin.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar un código 2FA
    const twoFactorCode = speakeasy.totp({
      secret: process.env.TWO_FACTOR_SECRET || '2fa-secret', // Genera una clave secreta (puedes usar una por usuario)
      encoding: 'base32',
    });

    // Simular envío del código por correo (usando nodemailer)
    await this.sendTwoFactorCode(email, twoFactorCode);

    // Guardar el código en la base de datos (temporal)
    await this.prisma.administrador.update({
      where: { email },
      data: { twoFactorCode }, // Asegúrate de agregar este campo en tu modelo
    });

    return { message: 'Código 2FA enviado al correo electrónico' };
  }

  async verify2FA(email: string, code: string): Promise<{ accessToken: string }> {
    const admin = await this.prisma.administrador.findUnique({ where: { email } });

    if (!admin || admin.twoFactorCode !== code) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    // Generar un token JWT
    const payload = { sub: admin.id_admin, email: admin.email };
    const accessToken = this.jwtService.sign(payload);

    // Limpiar el código 2FA después de la validación
    await this.prisma.administrador.update({
      where: { email },
      data: { twoFactorCode: null },
    });

    return { accessToken };
  }

  private async sendTwoFactorCode(email: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // O usa el servicio de correo que prefieras
      auth: {
        user: process.env.EMAIL_USER, // Tu correo electrónico
        pass: process.env.EMAIL_PASS, // Tu contraseña
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Tu código de verificación 2FA',
      text: `Tu código de verificación es: ${code}`,
    });
  }
}
