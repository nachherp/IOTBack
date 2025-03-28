/*
  Warnings:

  - You are about to drop the column `carga` on the `miembro` table. All the data in the column will be lost.
  - You are about to drop the column `id_equipos` on the `miembro` table. All the data in the column will be lost.
  - You are about to drop the `equipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proyecto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `recurso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usorecurso` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `equipo` DROP FOREIGN KEY `Equipo_id_proyecto_fkey`;

-- DropForeignKey
ALTER TABLE `miembro` DROP FOREIGN KEY `Miembro_id_equipos_fkey`;

-- DropForeignKey
ALTER TABLE `recurso` DROP FOREIGN KEY `Recurso_id_miembro_fkey`;

-- DropForeignKey
ALTER TABLE `recurso` DROP FOREIGN KEY `Recurso_id_proyecto_fkey`;

-- DropForeignKey
ALTER TABLE `usorecurso` DROP FOREIGN KEY `UsoRecurso_id_proyecto_fkey`;

-- DropForeignKey
ALTER TABLE `usorecurso` DROP FOREIGN KEY `UsoRecurso_id_recurso_fkey`;

-- DropIndex
DROP INDEX `Miembro_id_equipos_fkey` ON `miembro`;

-- AlterTable
ALTER TABLE `miembro` DROP COLUMN `carga`,
    DROP COLUMN `id_equipos`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `equipo`;

-- DropTable
DROP TABLE `proyecto`;

-- DropTable
DROP TABLE `recurso`;

-- DropTable
DROP TABLE `usorecurso`;

-- CreateTable
CREATE TABLE `Parcela` (
    `id_parcela` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `tipo_cultivo` VARCHAR(255) NOT NULL,
    `responsable` VARCHAR(255) NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `ultimo_riego` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_parcela`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HistorialSensor` (
    `id_registro` INTEGER NOT NULL AUTO_INCREMENT,
    `temperatura` DOUBLE NOT NULL,
    `humedad` DOUBLE NOT NULL,
    `lluvia` DOUBLE NOT NULL,
    `sol` DOUBLE NOT NULL,
    `fecha_registro` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_registro`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ParcelaEliminada` (
    `id_eliminada` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,
    `tipo_cultivo` VARCHAR(255) NOT NULL,
    `responsable` VARCHAR(255) NOT NULL,
    `latitud` DOUBLE NOT NULL,
    `longitud` DOUBLE NOT NULL,
    `fecha_eliminacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_eliminada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
