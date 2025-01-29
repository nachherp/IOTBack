import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtAuthGuard)
  @Get('perfil')
  getProfile() {
    return { message: 'Acceso permitido con JWT' };
  }
}
