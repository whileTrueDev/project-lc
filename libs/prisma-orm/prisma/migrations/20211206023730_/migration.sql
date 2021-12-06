/*
  Warnings:

  - You are about to drop the column `userId` on the `Broadcaster` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Broadcaster` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Broadcaster` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Broadcaster_userId_key` ON `Broadcaster`;

-- AlterTable
ALTER TABLE `Broadcaster` DROP COLUMN `userId`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Broadcaster_email_key` ON `Broadcaster`(`email`);
