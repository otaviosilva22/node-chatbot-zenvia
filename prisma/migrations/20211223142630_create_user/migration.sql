/*
  Warnings:

  - You are about to drop the column `input` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `input`,
    MODIFY `tentativas` INTEGER NULL,
    MODIFY `artista` VARCHAR(191) NULL,
    MODIFY `musica` VARCHAR(191) NULL;
