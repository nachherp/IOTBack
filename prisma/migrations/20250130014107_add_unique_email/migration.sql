/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Miembro` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Miembro_email_key` ON `Miembro`(`email`);
