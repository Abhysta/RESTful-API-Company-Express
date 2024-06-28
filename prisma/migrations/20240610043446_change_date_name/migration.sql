/*
  Warnings:

  - You are about to drop the column `date` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `company` DROP COLUMN `date`,
    ADD COLUMN `timeAdd` TEXT NULL;
