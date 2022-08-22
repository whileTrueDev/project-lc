-- social account 액세스,리프레시 토큰 길이에 따른 오류로 인해 Varchar(191) -> Text 로 타입 수정
-- AlterTable
ALTER TABLE `BroadcasterSocialAccount` MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;

-- AlterTable
ALTER TABLE `CustomerSocialAccount` MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;

-- AlterTable
ALTER TABLE `InactiveBroadcasterSocialAccount` MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;

-- AlterTable
ALTER TABLE `InactiveSellerSocialAccount` MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;

-- AlterTable
ALTER TABLE `SellerSocialAccount` MODIFY `accessToken` TEXT NULL,
    MODIFY `refreshToken` TEXT NULL;
