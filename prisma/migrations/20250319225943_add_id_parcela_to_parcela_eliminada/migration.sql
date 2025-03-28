/*
  Warnings:

  - The primary key for the `parcelaeliminada` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_eliminada` on the `parcelaeliminada` table. All the data in the column will be lost.
  - You are about to alter the column `nombre` on the `parcelaeliminada` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `tipo_cultivo` on the `parcelaeliminada` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `responsable` on the `parcelaeliminada` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Added the required column `id` to the `ParcelaEliminada` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_parcela` to the `ParcelaEliminada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `parcelaeliminada` DROP PRIMARY KEY,
    DROP COLUMN `id_eliminada`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `id_parcela` INTEGER NOT NULL,
    MODIFY `nombre` VARCHAR(191) NOT NULL,
    MODIFY `tipo_cultivo` VARCHAR(191) NOT NULL,
    MODIFY `responsable` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
