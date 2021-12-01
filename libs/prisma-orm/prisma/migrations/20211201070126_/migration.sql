-- AlterTable
ALTER TABLE `Broadcaster` ADD COLUMN `agreementFlag` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `avatar` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;
