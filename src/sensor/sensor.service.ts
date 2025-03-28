import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class SensorService {
  constructor(private prisma: PrismaService) {}

  private API_URL = 'https://moriahmkt.com/iotapp/updated/';

  // 1. Guardar datos de sensores
  async fetchAndStoreSensorData() {
    try {
      const response = await axios.get(this.API_URL);

      if (!response.data || !response.data.sensores) {
        console.error(" No se recibieron datos válidos de la API.");
        return;
      }

      const { temperatura, humedad, lluvia, sol } = response.data.sensores;

      if (
        temperatura === undefined || humedad === undefined ||
        lluvia === undefined || sol === undefined
      ) {
        console.error(" Datos incompletos de sensores.");
        return;
      }

      const lastRecord = await this.prisma.historialSensor.findFirst({
        orderBy: { fecha_registro: 'desc' },
      });

      if (
        !lastRecord ||
        lastRecord.temperatura !== temperatura ||
        lastRecord.humedad !== humedad ||
        lastRecord.lluvia !== lluvia ||
        lastRecord.sol !== sol
      ) {
        await this.prisma.historialSensor.create({
          data: { temperatura, humedad, lluvia, sol, fecha_registro: new Date() },
        });
        console.log(' Nuevo registro de sensores guardado.');
      } else {
        console.log('ℹ No hay cambios en los sensores.');
      }
    } catch (error) {
      console.error(' Error al obtener datos de sensores:', error.message);
    }
  }

  // 2. Crear o actualizar parcelas activas
  async fetchAndStoreParcelas() {
    try {
      const response = await axios.get(this.API_URL);
      const parcelasAPI = response.data.parcelas;

      for (const parcela of parcelasAPI) {
        const existingParcela = await this.prisma.parcela.findUnique({
          where: { id_parcela: parcela.id },
        });

        if (!existingParcela) {
          await this.prisma.parcela.create({
            data: {
              id_parcela: parcela.id,
              nombre: parcela.nombre,
              tipo_cultivo: parcela.tipo_cultivo,
              responsable: parcela.responsable,
              latitud: parcela.latitud,
              longitud: parcela.longitud,
              ultimo_riego: new Date(parcela.ultimo_riego),
            },
          });
          console.log(`Nueva parcela agregada: ${parcela.nombre}`);
        } else {
          // Si ha cambiado algo (latitud, longitud o último riego)
          if (
            existingParcela.latitud !== parcela.latitud ||
            existingParcela.longitud !== parcela.longitud ||
            new Date(existingParcela.ultimo_riego).getTime() !== new Date(parcela.ultimo_riego).getTime()
          ) {
            await this.prisma.parcela.update({
              where: { id_parcela: parcela.id },
              data: {
                latitud: parcela.latitud,
                longitud: parcela.longitud,
                ultimo_riego: new Date(parcela.ultimo_riego),
              },
            });
            console.log(` Parcela actualizada (${parcela.nombre}):  Último riego`);
          }
        }
      }

      console.log(' Parcelas activas sincronizadas.');
    } catch (error) {
      console.error(' Error al obtener parcelas:', error.message);
    }
  }

  // 3. Verificar y guardar parcelas eliminadas
  async fetchAndStoreParcelasEliminadas() {
    try {
      const response = await axios.get(this.API_URL);
      const idsAPI = response.data.parcelas.map(p => p.id);

      const parcelasDB = await this.prisma.parcela.findMany();
      const parcelasEliminadas = parcelasDB.filter(p => !idsAPI.includes(p.nombre));

      for (const parcela of parcelasEliminadas) {
        const yaExiste = await this.prisma.parcelaEliminada.findUnique({
          where: { id_parcela: parcela.id_parcela },
        });

        if (!yaExiste) {
          await this.prisma.parcelaEliminada.create({
            data: {
              id_parcela: parcela.id_parcela,
              nombre: parcela.nombre,
              tipo_cultivo: parcela.tipo_cultivo,
              responsable: parcela.responsable,
              latitud: parcela.latitud,
              longitud: parcela.longitud,
              fecha_eliminacion: new Date(),
            },
          });

          await this.prisma.parcela.delete({ where: { id_parcela: parcela.id_parcela } });
          console.log(` Parcela eliminada registrada: ${parcela.nombre}`);
        }
      }

      console.log(' Parcelas eliminadas registradas.');
    } catch (error) {
      console.error(' Error al verificar parcelas eliminadas:', error.message);
    }
  }

  // 4. Dashboard principal
  async getDashboardData() {
    const lastRecord = await this.prisma.historialSensor.findFirst({
      orderBy: { fecha_registro: 'desc' },
    });

    const parcelas = await this.prisma.parcela.findMany();
    return { lastRecord, parcelas };
  }

  // 5. Historial
  async getHistorial() {
    return this.prisma.historialSensor.findMany({
      orderBy: { fecha_registro: 'asc' },
    });
  }

  // 6. Parcelas eliminadas
  async getParcelasEliminadas() {
    return this.prisma.parcelaEliminada.findMany({
      orderBy: { fecha_eliminacion: 'asc' },
    });
  }

  // 7. Parcelas disponibles
  async getParcelas() {
    const parcelas = await this.prisma.parcela.findMany();
    return { parcelas };
  }
}
