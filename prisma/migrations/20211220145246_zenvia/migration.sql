/*
  Warnings:

  - Added the required column `artista` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `musica` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `artista` VARCHAR(191) NOT NULL,
    ADD COLUMN `musica` VARCHAR(191) NOT NULL;
