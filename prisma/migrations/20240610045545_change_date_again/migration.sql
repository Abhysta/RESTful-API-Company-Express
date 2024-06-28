/*
  Warnings:

  - You are about to alter the column `timeAdd` on the `company` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `company` MODIFY `timeAdd` DATETIME NULL;
