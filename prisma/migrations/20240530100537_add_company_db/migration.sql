-- CreateTable
CREATE TABLE `company` (
    `id_company` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `email_company` VARCHAR(100) NULL,
    `position` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(100) NULL,
    `address` VARCHAR(100) NULL,
    `id_user` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id_company`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
