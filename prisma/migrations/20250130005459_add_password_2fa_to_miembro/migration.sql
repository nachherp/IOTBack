/*
  Warnings:

  - You are about to drop the column `twoFactorCode` on the `administrador` table. All the data in the column will be lost.
  - Added the required column `password` to the `Miembro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `administrador` DROP COLUMN `twoFactorCode`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `twoFactorSecret` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `miembro` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `twoFactorSecret` VARCHAR(191) NULL;
