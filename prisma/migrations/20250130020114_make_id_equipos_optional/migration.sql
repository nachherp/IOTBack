-- DropForeignKey
ALTER TABLE `miembro` DROP FOREIGN KEY `Miembro_id_equipos_fkey`;

-- DropIndex
DROP INDEX `Miembro_id_equipos_fkey` ON `miembro`;

-- AlterTable
ALTER TABLE `miembro` MODIFY `telefono` BIGINT NULL,
    MODIFY `rol` VARCHAR(50) NULL,
    MODIFY `carga` INTEGER NULL,
    MODIFY `edad` INTEGER NULL,
    MODIFY `id_equipos` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Miembro` ADD CONSTRAINT `Miembro_id_equipos_fkey` FOREIGN KEY (`id_equipos`) REFERENCES `Equipo`(`id_equipo`) ON DELETE SET NULL ON UPDATE CASCADE;
