-- AlterTable
ALTER TABLE `Inquiry` MODIFY `phoneNumber` VARCHAR(191) NULL,
    MODIFY `brandName` VARCHAR(191) NULL,
    MODIFY `homepage` VARCHAR(191) NULL,
    MODIFY `readFlag` BOOLEAN NULL DEFAULT false;
