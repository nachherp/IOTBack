import { Controller, Post, Body, UseGuards, Request, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() body) {
    const { email, password, nombre } = body;
    return this.authService.registerMiembro(email, password, nombre);
  }

  @Post('login')
  async login(@Body() body, @Res() response: Response) {
    const { email, password } = body;
    try {
      const result = await this.authService.login(email, password);
      response.status(HttpStatus.OK).json(result);
    } catch (error) {
      response.status(HttpStatus.UNAUTHORIZED).json({ error: 'Credenciales de inicio de sesión inválidas' });
    }
  }

  @Post('generate-2fa-secret')
  async generateTwoFactorSecret(@Body('email') email: string, @Res() res: Response) {
    try {
      const qrCode = await this.authService.generateTwoFactorSecret(email);
      res.status(HttpStatus.OK).json({ qrCode });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }
  
  @Post('verify-2fa')
  async verifyTwoFactorCode(@Body() body, @Res() res: Response) {
    const { email, code } = body;
    try {
      const result = await this.authService.verifyTwoFactorCode(email, code);
      if (result.success) {
        const token = this.jwtService.sign({ email });
        res.status(HttpStatus.OK).json({ message: 'Verification successful', token });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: result.message });
      }
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('protected-route')
  async protectedRoute(@Request() req) {
    return { message: 'This is a protected route', user: req.user };
  }
}
