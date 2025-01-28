import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Permitir solicitudes desde tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
    credentials: true, // Permitir el uso de cookies o encabezados de autorización
  });

  await app.listen(5000); // Confirma que estás escuchando en el puerto 5000
}
bootstrap();
