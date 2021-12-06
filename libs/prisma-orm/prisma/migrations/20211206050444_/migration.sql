-- DropIndex
DROP INDEX `Broadcaster_email_idx` ON `Broadcaster`;

-- DropIndex
DROP INDEX `BroadcasterChannel_broadcasterId_fkey` ON `BroadcasterChannel`;

-- AddForeignKey
ALTER TABLE `BroadcasterAddress` ADD CONSTRAINT `BroadcasterAddress_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterChannel` ADD CONSTRAINT `BroadcasterChannel_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
