import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: any; // Agregar `user` a la interfaz de Express
  }
}
