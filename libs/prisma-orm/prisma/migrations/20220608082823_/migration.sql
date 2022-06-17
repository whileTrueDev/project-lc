-- AlterTable
ALTER TABLE `PrivacyApproachHistory` MODIFY `infoType` ENUM('broadcasterSettlementAccount', 'broadcasterIdCard', 'sellerSettlementAccount', 'sellerBusinessRegistration', 'sellerMailOrderCertificate', 'broadcasterList', 'sellerList', 'customerList', 'orderList') NOT NULL;
