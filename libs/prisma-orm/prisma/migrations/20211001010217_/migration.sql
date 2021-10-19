/*
  Warnings:

  - A unique constraint covering the columns `[overlayUrl]` on the table `Broadcaster` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Broadcaster_overlayUrl_key` ON `Broadcaster`(`overlayUrl`);
