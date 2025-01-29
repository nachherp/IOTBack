import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  try {
    const users = await prisma.administrador.findMany(); // Obtener todos los usuarios

    for (const user of users) {
      if (!user.password.startsWith('$2b$')) { // Si ya está hasheada, saltarla
        const hashedPassword = await bcrypt.hash(user.password, 10);

        await prisma.administrador.update({
          where: { id_admin: user.id_admin },
          data: { password: hashedPassword },
        });

        console.log(`Contraseña de ${user.email} actualizada`);
      }
    }

    console.log('✅ Todas las contraseñas han sido hasheadas correctamente.');
  } catch (error) {
    console.error('❌ Error al actualizar contraseñas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

hashExistingPasswords();
