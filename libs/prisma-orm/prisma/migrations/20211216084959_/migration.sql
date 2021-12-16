/*
  Warnings:

  - Added the required column `content` to the `Inquiry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Inquiry` ADD COLUMN `content` LONGTEXT NOT NULL;
