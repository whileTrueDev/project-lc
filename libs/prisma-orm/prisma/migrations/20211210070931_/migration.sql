-- CreateTable
CREATE TABLE `BroadcasterSettlementInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('naturalPerson', 'selfEmployedBusiness') NOT NULL DEFAULT 'naturalPerson',
    `name` VARCHAR(191) NOT NULL,
    `idCardNumber` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `bank` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `accountHolder` VARCHAR(191) NOT NULL,
    `idCardImageName` VARCHAR(191) NOT NULL,
    `accountImageName` VARCHAR(191) NOT NULL,
    `taxManageAgreement` BOOLEAN NOT NULL DEFAULT false,
    `personalInfoAgreement` BOOLEAN NOT NULL DEFAULT false,
    `settlementAgreement` BOOLEAN NULL,
    `broadcasterId` INTEGER NOT NULL,

    UNIQUE INDEX `BroadcasterSettlementInfo_broadcasterId_key`(`broadcasterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BroadcasterSettlementInfoConfirmation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('waiting', 'confirmed', 'rejected') NOT NULL DEFAULT 'waiting',
    `rejectionReason` TEXT NULL,
    `settlementInfoId` INTEGER NOT NULL,

    UNIQUE INDEX `BroadcasterSettlementInfoConfirmation_settlementInfoId_key`(`settlementInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementInfo` ADD CONSTRAINT `BroadcasterSettlementInfo_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementInfoConfirmation` ADD CONSTRAINT `BroadcasterSettlementInfoConfirmation_settlementInfoId_fkey` FOREIGN KEY (`settlementInfoId`) REFERENCES `BroadcasterSettlementInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
