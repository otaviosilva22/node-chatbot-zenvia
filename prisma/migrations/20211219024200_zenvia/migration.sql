-- CreateTable
CREATE TABLE `User` (
    `nome` VARCHAR(191) NOT NULL,
    `cellphone` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `tentativas` INTEGER NOT NULL,
    `input` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`cellphone`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
