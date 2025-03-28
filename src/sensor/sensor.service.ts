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

      const sensores = response.data?.sensores;
      if (!sensores) {
        console.error("No se recibieron datos de sensores.");
        return;
      }

      const { temperatura, humedad, lluvia, sol } = sensores;
      if ([temperatura, humedad, lluvia, sol].some((v) => v === undefined)) {
        console.error("Datos de sensores incompletos.");
        return;
      }

      const last = await this.prisma.historialSensor.findFirst({
        orderBy: { fecha_registro: 'desc' },
      });

      if (!last || last.temperatura !== temperatura || last.humedad !== humedad || last.lluvia !== lluvia || last.sol !== sol) {
        await this.prisma.historialSensor.create({
          data: { temperatura, humedad, lluvia, sol, fecha_registro: new Date() },
        });
        console.log("✅ Nuevo registro de sensores guardado.");
      } else {
        console.log("ℹ No hay cambios en los datos de sensores.");
      }
    } catch (error) {
      console.error("❌ Error al obtener datos de sensores:", error.message);
    }
  }

  // 2. Crear o actualizar parcelas activas
  async fetchAndStoreParcelas() {
    try {
      const response = await axios.get(this.API_URL);
      const parcelasAPI = response.data.parcelas;

      for (const parcela of parcelasAPI) {
        const existente = await this.prisma.parcela.findUnique({
          where: { id_parcela: parcela.id },
        });

        if (!existente) {
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
          console.log(`🌱 Parcela creada: ${parcela.nombre}`);
        } else {
          const haCambiado =
            existente.latitud !== parcela.latitud ||
            existente.longitud !== parcela.longitud ||
            new Date(existente.ultimo_riego).getTime() !== new Date(parcela.ultimo_riego).getTime();

          if (haCambiado) {
            await this.prisma.parcela.update({
              where: { id_parcela: parcela.id },
              data: {
                latitud: parcela.latitud,
                longitud: parcela.longitud,
                ultimo_riego: new Date(parcela.ultimo_riego),
              },
            });
            console.log(`🔄 Parcela actualizada: ${parcela.nombre}`);
          }
        }
      }

      console.log("✅ Parcelas sincronizadas correctamente.");
    } catch (error) {
      console.error("❌ Error al sincronizar parcelas:", error.message);
    }
  }

  // 3. Eliminar las parcelas que ya no existen en la API
  async fetchAndStoreParcelasEliminadas() {
    try {
      const response = await axios.get(this.API_URL);
      const idsAPI = response.data.parcelas.map(p => p.id);

      const parcelasDB = await this.prisma.parcela.findMany();
      const eliminadas = parcelasDB.filter(p => !idsAPI.includes(p.id_parcela));

      for (const parcela of eliminadas) {
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

          await this.prisma.parcela.delete({
            where: { id_parcela: parcela.id_parcela },
          });

          console.log(`🗑️ Parcela eliminada registrada: ${parcela.nombre}`);
        }
      }

      console.log("✅ Verificación de parcelas eliminadas completada.");
    } catch (error) {
      console.error("❌ Error al eliminar parcelas:", error.message);
    }
  }

  // 4. Datos del dashboard
  async getDashboardData() {
    const lastRecord = await this.prisma.historialSensor.findFirst({
      orderBy: { fecha_registro: 'desc' },
    });

    const parcelas = await this.prisma.parcela.findMany();
    return { lastRecord, parcelas };
  }

  // 5. Historial completo
  async getHistorial() {
    return this.prisma.historialSensor.findMany({
      orderBy: { fecha_registro: 'asc' },
    });
  }

  // 6. Parcelas eliminadas
  async getParcelasEliminadas() {
    return this.prisma.parcelaEliminada.findMany({
      orderBy: { fecha_eliminacion: 'desc' },
    });
  }

  // 7. Parcelas activas
  async getParcelas() {
    return {
      parcelas: await this.prisma.parcela.findMany(),
    };
  }
}
