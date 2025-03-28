/*
  Warnings:

  - A unique constraint covering the columns `[id_parcela]` on the table `ParcelaEliminada` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `historialsensor` ADD COLUMN `id_parcela` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `ParcelaEliminada_id_parcela_key` ON `ParcelaEliminada`(`id_parcela`);

-- AddForeignKey
ALTER TABLE `HistorialSensor` ADD CONSTRAINT `HistorialSensor_id_parcela_fkey` FOREIGN KEY (`id_parcela`) REFERENCES `Parcela`(`id_parcela`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ParcelaEliminada` ADD CONSTRAINT `ParcelaEliminada_id_parcela_fkey` FOREIGN KEY (`id_parcela`) REFERENCES `Parcela`(`id_parcela`) ON DELETE RESTRICT ON UPDATE CASCADE;
