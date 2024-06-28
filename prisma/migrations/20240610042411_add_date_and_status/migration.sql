/*
  Warnings:

  - Added the required column `status` to the `company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `date` TEXT NULL,
    ADD COLUMN `status` VARCHAR(100) NOT NULL;
