import { Controller, Get } from '@nestjs/common';
import { SensorService } from './sensor.service';

@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  // Sincroniza sensores, parcelas activas y eliminadas
  @Get('/sync')
  async syncSensorData() {
    await this.sensorService.fetchAndStoreSensorData();
    await this.sensorService.fetchAndStoreParcelas();
    await this.sensorService.fetchAndStoreParcelasEliminadas();
    return { message: 'Datos sincronizados correctamente' };
  }

  // Datos actuales para el Dashboard
  @Get('/dashboard')
  async getDashboardData() {
    return this.sensorService.getDashboardData();
  }

  // Historial de sensores (para gráficas)
  @Get('/historial')
  async getHistorialSensores() {
    return this.sensorService.getHistorial();
  }

  // Parcelas eliminadas
  @Get('/eliminadas')
  async getParcelasEliminadas() {
    return this.sensorService.getParcelasEliminadas();
  }

  // Parcelas activas
  @Get('/parcelas')
  async getParcelas() {
    return this.sensorService.getParcelas();
  }
}
