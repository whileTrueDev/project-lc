/*
  Warnings:

  - You are about to alter the column `userName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.
  - You are about to alter the column `userNickname` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(20)`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `userName` VARCHAR(20) NOT NULL,
    MODIFY `userNickname` VARCHAR(20) NOT NULL;
