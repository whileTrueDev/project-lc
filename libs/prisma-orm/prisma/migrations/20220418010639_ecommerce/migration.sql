/*
  Warnings:

  - A unique constraint covering the columns `[informationNoticeId]` on the table `Goods` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `BroadcasterPromotionPage` ADD COLUMN `comment` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `BroadcasterSettlementItems` ADD COLUMN `relatedOrderId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Goods` ADD COLUMN `informationNoticeId` INTEGER NULL,
    ADD COLUMN `searchKeyword` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ProductPromotion` ADD COLUMN `broadcasterId` INTEGER NULL;

-- AlterTable
ALTER TABLE `SellerSettlementItems` ADD COLUMN `relatedOrderId` INTEGER NULL;

-- CreateTable
CREATE TABLE `MileageSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `defaultMileagePercent` INTEGER NOT NULL DEFAULT 0,
    `mileageStrategy` ENUM('onPaymentPriceExceptMileageUsage', 'onPaymentPrice', 'noMileage') NOT NULL DEFAULT 'onPaymentPriceExceptMileageUsage',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `avatar` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `gender` ENUM('male', 'female', 'unknown') NULL DEFAULT 'unknown',
    `birthDate` DATETIME(3) NULL,
    `agreementFlag` BOOLEAN NOT NULL DEFAULT false,
    `inactiveFlag` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerFollowBroadcaster` (
    `customerId` INTEGER NOT NULL,
    `broadcasterId` INTEGER NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`customerId`, `broadcasterId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerSocialAccount` (
    `serviceId` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `registDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profileImage` VARCHAR(191) NULL,
    `accessToken` VARCHAR(191) NULL,
    `refreshToken` VARCHAR(191) NULL,
    `customerId` INTEGER NOT NULL,

    INDEX `customerId`(`customerId`),
    PRIMARY KEY (`serviceId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerAddress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `recipient` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `detailAddress` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `memo` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerNotificationSetting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderDelivery` BOOLEAN NOT NULL DEFAULT true,
    `review` BOOLEAN NOT NULL DEFAULT true,
    `restock` BOOLEAN NOT NULL DEFAULT true,
    `advertisement` BOOLEAN NOT NULL DEFAULT true,
    `customerId` INTEGER NOT NULL,

    UNIQUE INDEX `CustomerNotificationSetting_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerMileage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `mileage` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `CustomerMileage_customerId_key`(`customerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerMileageLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `actionType` ENUM('consume', 'earn') NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reason` VARCHAR(191) NOT NULL,
    `orderId` INTEGER NULL,
    `reviewId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` INTEGER NOT NULL DEFAULT 0,
    `unit` ENUM('P', 'W') NOT NULL DEFAULT 'P',
    `maxDiscountAmountWon` INTEGER NULL,
    `minOrderAmountWon` INTEGER NOT NULL DEFAULT 0,
    `name` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NULL,
    `applyField` ENUM('goods', 'shipping') NOT NULL DEFAULT 'goods',
    `applyType` ENUM('selectedGoods', 'exceptSelectedGoods', 'allGoods') NOT NULL DEFAULT 'allGoods',
    `memo` VARCHAR(191) NULL,
    `concurrentFlag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerCoupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `couponId` INTEGER NOT NULL,
    `customerId` INTEGER NOT NULL,
    `issueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('expired', 'notUsed', 'used') NOT NULL DEFAULT 'notUsed',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerCouponLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerCouponId` INTEGER NOT NULL,
    `orderId` INTEGER NULL,
    `type` ENUM('issue', 'use', 'restore') NOT NULL DEFAULT 'issue',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `customerId` INTEGER NULL,
    `tempUserId` VARCHAR(191) NULL,
    `goodsId` INTEGER NULL,
    `shippingGroupId` INTEGER NULL,
    `channel` ENUM('liveShopping', 'productPromotion', 'normal') NOT NULL DEFAULT 'normal',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItemOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartItemId` INTEGER NOT NULL,
    `goodsOptionsId` INTEGER NULL,
    `name` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `normalPrice` DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2) NOT NULL,
    `weight` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItemSupport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `broadcasterId` INTEGER NULL,
    `cartItemId` INTEGER NULL,
    `liveShoppingId` INTEGER NULL,
    `productPromotionId` INTEGER NULL,

    UNIQUE INDEX `CartItemSupport_cartItemId_key`(`cartItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `rating` DOUBLE NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `writerId` INTEGER NOT NULL,
    `goodsId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsReviewImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imageUrl` VARCHAR(191) NOT NULL,
    `goodsReviewId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsReviewComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewId` INTEGER NOT NULL,
    `customerId` INTEGER NULL,
    `writtenBySellerFlag` BOOLEAN NOT NULL DEFAULT false,
    `sellerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInquiry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `status` ENUM('requested', 'answered', 'adminAnswered') NOT NULL DEFAULT 'requested',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `writerId` INTEGER NOT NULL,
    `goodsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInquiryComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `goodsInquiryId` INTEGER NOT NULL,
    `writtenBySellerFlag` BOOLEAN NOT NULL DEFAULT false,
    `adminId` INTEGER NULL,
    `sellerId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderCode` VARCHAR(191) NULL,
    `customerId` INTEGER NULL,
    `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived',
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderPrice` INTEGER NOT NULL,
    `paymentPrice` INTEGER NOT NULL,
    `recipientName` VARCHAR(191) NOT NULL,
    `recipientPhone` VARCHAR(191) NOT NULL,
    `recipientEmail` VARCHAR(191) NOT NULL,
    `recipientAddress` VARCHAR(191) NOT NULL,
    `recipientDetailAddress` VARCHAR(191) NOT NULL,
    `recipientPostalCode` VARCHAR(191) NOT NULL,
    `ordererName` VARCHAR(191) NOT NULL,
    `ordererPhone` VARCHAR(191) NOT NULL,
    `ordererEmail` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `nonMemberOrderFlag` BOOLEAN NOT NULL DEFAULT false,
    `giftFlag` BOOLEAN NOT NULL DEFAULT false,
    `supportOrderIncludeFlag` BOOLEAN NOT NULL DEFAULT false,
    `bundleFlag` BOOLEAN NOT NULL DEFAULT false,
    `deleteFlag` BOOLEAN NULL DEFAULT false,
    `cashReceipts` VARCHAR(191) NULL,

    UNIQUE INDEX `Order_orderCode_key`(`orderCode`),
    INDEX `Order_orderCode_idx`(`orderCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `method` ENUM('card', 'transfer', 'virtualAccount') NOT NULL,
    `orderId` INTEGER NULL,
    `paymentKey` VARCHAR(191) NOT NULL,
    `depositDate` DATETIME(3) NULL,
    `depositor` VARCHAR(191) NULL,
    `depositSecret` VARCHAR(191) NULL,
    `depositDoneFlag` BOOLEAN NOT NULL DEFAULT false,
    `depositDueDate` DATETIME(3) NULL,
    `depositStatus` ENUM('WAITING', 'PARTIAL_DONE', 'DONE', 'CANCELED') NULL DEFAULT NULL,
    `account` VARCHAR(191) NULL,

    UNIQUE INDEX `OrderPayment_orderId_key`(`orderId`),
    UNIQUE INDEX `OrderPayment_paymentKey_key`(`paymentKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `goodsId` INTEGER NULL,
    `reviewId` INTEGER NULL,
    `channel` ENUM('liveShopping', 'productPromotion', 'normal') NOT NULL DEFAULT 'normal',
    `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `shippingCostIncluded` BOOLEAN NOT NULL DEFAULT false,
    `shippingGroupId` INTEGER NOT NULL,
    `orderShippingId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItemOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderItemId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `quantity` INTEGER NOT NULL,
    `normalPrice` DECIMAL(10, 2) NOT NULL,
    `discountPrice` DECIMAL(10, 2) NOT NULL,
    `weight` DOUBLE NULL,
    `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived',
    `goodsOptionId` INTEGER NULL,
    `goodsName` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItemSupport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `broadcasterId` INTEGER NULL,
    `orderItemId` INTEGER NULL,
    `liveShoppingId` INTEGER NULL,
    `productPromotionId` INTEGER NULL,

    UNIQUE INDEX `OrderItemSupport_orderItemId_key`(`orderItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderShipping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shippingCostPayType` ENUM('free', 'prepay', 'postpaid') NOT NULL DEFAULT 'prepay',
    `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `shippingMethod` ENUM('delivery', 'postpaid', 'each_delivery', 'each_postpaid', 'quick', 'direct_delivery', 'direct_store', 'freight', 'direct', 'coupon') NULL,
    `shippingGroupId` INTEGER NULL,
    `shippingSetId` INTEGER NULL,
    `orderId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Refund` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refundCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `completeDate` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reason` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NULL,
    `refundBank` VARCHAR(191) NULL,
    `refundAccount` VARCHAR(191) NULL,
    `refundAccountHolder` VARCHAR(191) NULL,
    `responsibility` VARCHAR(191) NULL,
    `refundAmount` INTEGER NOT NULL,
    `paymentKey` VARCHAR(191) NULL,
    `transactionKey` VARCHAR(191) NULL,

    UNIQUE INDEX `Refund_refundCode_key`(`refundCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RefundItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refundId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `orderItemOptionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Return` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `returnCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('requested', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completeDate` DATETIME(3) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NULL,
    `returnBank` VARCHAR(191) NULL,
    `returnBankAccount` VARCHAR(191) NULL,
    `rejectReason` VARCHAR(191) NULL,
    `returnAddress` VARCHAR(191) NULL,
    `responsibility` VARCHAR(191) NULL,
    `refundId` INTEGER NULL,

    UNIQUE INDEX `Return_returnCode_key`(`returnCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReturnItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `returnId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `orderItemOptionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('requested', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `getBackFlag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReturnImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imageUrl` VARCHAR(191) NOT NULL,
    `returnId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Exchange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exchangeCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('requested', 'collected', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completeDate` DATETIME(3) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `rejectReason` VARCHAR(191) NULL,
    `returnAddress` VARCHAR(191) NULL,
    `responsibility` VARCHAR(191) NULL,
    `recipientAddress` VARCHAR(191) NULL,
    `recipientDetailAddress` VARCHAR(191) NULL,
    `recipientPostalCode` VARCHAR(191) NULL,
    `recipientShippingMemo` VARCHAR(191) NULL,
    `memo` VARCHAR(191) NULL,
    `exportId` INTEGER NULL,

    UNIQUE INDEX `Exchange_exchangeCode_key`(`exchangeCode`),
    UNIQUE INDEX `Exchange_exportId_key`(`exportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExchangeItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exchangeId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `orderItemOptionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('requested', 'collected', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `getBackFlag` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExchangeImage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imageUrl` VARCHAR(191) NOT NULL,
    `exchangeId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderCancellation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cancelCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('requested', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completeDate` DATETIME(3) NULL,
    `reason` VARCHAR(191) NULL,
    `rejectReason` VARCHAR(191) NULL,
    `responsibility` VARCHAR(191) NULL,
    `refundId` INTEGER NULL,

    UNIQUE INDEX `OrderCancellation_cancelCode_key`(`cancelCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderCancellationItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderCancellationId` INTEGER NOT NULL,
    `orderItemId` INTEGER NOT NULL,
    `orderItemOptionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `status` ENUM('requested', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Export` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exportCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'exportDone',
    `deliveryCompany` VARCHAR(191) NOT NULL,
    `deliveryNumber` VARCHAR(191) NOT NULL,
    `bundleExportCode` VARCHAR(191) NULL,
    `exportDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `shippingDoneDate` DATETIME(3) NULL,
    `exchangeExportedFlag` BOOLEAN NOT NULL DEFAULT false,
    `buyConfirmDate` DATETIME(3) NULL,
    `buyConfirmSubject` ENUM('admin', 'customer', 'system') NULL,
    `sellerId` INTEGER NULL,
    `sellerSettlementsId` INTEGER NULL,
    `broadcasterSettlementItemsId` INTEGER NULL,

    UNIQUE INDEX `Export_exportCode_key`(`exportCode`),
    UNIQUE INDEX `Export_sellerSettlementsId_key`(`sellerSettlementsId`),
    UNIQUE INDEX `Export_broadcasterSettlementItemsId_key`(`broadcasterSettlementItemsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExportItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderItemId` INTEGER NOT NULL,
    `orderItemOptionId` INTEGER NOT NULL,
    `amount` INTEGER NOT NULL,
    `exportId` INTEGER NOT NULL,
    `status` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'exportDone',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInformationSubject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject` VARCHAR(191) NOT NULL,
    `items` JSON NOT NULL,

    UNIQUE INDEX `GoodsInformationSubject_subject_key`(`subject`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInformationNotice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contents` JSON NOT NULL,
    `goodsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryCode` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mainCategoryFlag` BOOLEAN NOT NULL DEFAULT false,
    `parentCategoryId` INTEGER NULL,
    `informationSubjectId` INTEGER NULL,

    UNIQUE INDEX `GoodsCategory_categoryCode_key`(`categoryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoodsToGoodsCategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoodsToGoodsCategory_AB_unique`(`A`, `B`),
    INDEX `_GoodsToGoodsCategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_LikedReviews` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_LikedReviews_AB_unique`(`A`, `B`),
    INDEX `_LikedReviews_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CustomerToLiveShopping` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CustomerToLiveShopping_AB_unique`(`A`, `B`),
    INDEX `_CustomerToLiveShopping_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CouponToGoods` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CouponToGoods_AB_unique`(`A`, `B`),
    INDEX `_CouponToGoods_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `ConfirmHistory` DROP COLUMN `reason`;
ALTER TABLE `PrivacyApproachHistory` ADD COLUMN `reason` VARCHAR(191) NULL;
ALTER TABLE `PrivacyApproachHistory` MODIFY `infoType` ENUM('broadcasterSettlementAccount', 'broadcasterIdCard', 'sellerSettlementAccount', 'sellerBusinessRegistration', 'sellerMailOrderCertificate', 'broadcasterList', 'sellerList', 'customerList', 'orderList') NOT NULL;
-- AlterTable
ALTER TABLE `Goods` DROP COLUMN `informationNoticeId`;

-- CreateIndex
CREATE UNIQUE INDEX `GoodsInformationNotice_goodsId_key` ON `GoodsInformationNotice`(`goodsId`);
-- AddForeignKey
ALTER TABLE `GoodsInformationNotice` ADD CONSTRAINT `GoodsInformationNotice_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
-- AlterTable
ALTER TABLE `Policy` MODIFY `targetUser` ENUM('seller', 'broadcaster', 'customer', 'all') NOT NULL;
-- AddForeignKey
ALTER TABLE `CustomerCouponLog` ADD CONSTRAINT `CustomerCouponLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_relatedOrderId_fkey` FOREIGN KEY (`relatedOrderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BroadcasterSettlementItems` ADD CONSTRAINT `BroadcasterSettlementItems_relatedOrderId_fkey` FOREIGN KEY (`relatedOrderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductPromotion` ADD CONSTRAINT `ProductPromotion_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerFollowBroadcaster` ADD CONSTRAINT `CustomerFollowBroadcaster_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerFollowBroadcaster` ADD CONSTRAINT `CustomerFollowBroadcaster_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSocialAccount` ADD CONSTRAINT `CustomerSocialAccount_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerAddress` ADD CONSTRAINT `CustomerAddress_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerNotificationSetting` ADD CONSTRAINT `CustomerNotificationSetting_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMileage` ADD CONSTRAINT `CustomerMileage_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMileageLog` ADD CONSTRAINT `CustomerMileageLog_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerMileageLog` ADD CONSTRAINT `CustomerMileageLog_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCouponLog` ADD CONSTRAINT `CustomerCouponLog_customerCouponId_fkey` FOREIGN KEY (`customerCouponId`) REFERENCES `CustomerCoupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemOption` ADD CONSTRAINT `CartItemOption_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemOption` ADD CONSTRAINT `CartItemOption_goodsOptionsId_fkey` FOREIGN KEY (`goodsOptionsId`) REFERENCES `GoodsOptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemSupport` ADD CONSTRAINT `CartItemSupport_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemSupport` ADD CONSTRAINT `CartItemSupport_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemSupport` ADD CONSTRAINT `CartItemSupport_productPromotionId_fkey` FOREIGN KEY (`productPromotionId`) REFERENCES `ProductPromotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemSupport` ADD CONSTRAINT `CartItemSupport_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReview` ADD CONSTRAINT `GoodsReview_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReview` ADD CONSTRAINT `GoodsReview_writerId_fkey` FOREIGN KEY (`writerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReviewImage` ADD CONSTRAINT `GoodsReviewImage_goodsReviewId_fkey` FOREIGN KEY (`goodsReviewId`) REFERENCES `GoodsReview`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReviewComment` ADD CONSTRAINT `GoodsReviewComment_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReviewComment` ADD CONSTRAINT `GoodsReviewComment_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsReviewComment` ADD CONSTRAINT `GoodsReviewComment_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `GoodsReview`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInquiry` ADD CONSTRAINT `GoodsInquiry_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInquiry` ADD CONSTRAINT `GoodsInquiry_writerId_fkey` FOREIGN KEY (`writerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInquiryComment` ADD CONSTRAINT `GoodsInquiryComment_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInquiryComment` ADD CONSTRAINT `GoodsInquiryComment_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsInquiryComment` ADD CONSTRAINT `GoodsInquiryComment_goodsInquiryId_fkey` FOREIGN KEY (`goodsInquiryId`) REFERENCES `GoodsInquiry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderPayment` ADD CONSTRAINT `OrderPayment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `GoodsReview`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderShippingId_fkey` FOREIGN KEY (`orderShippingId`) REFERENCES `OrderShipping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE `OrderShipping` ADD CONSTRAINT `OrderShipping_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderShipping` ADD CONSTRAINT `OrderShipping_shippingSetId_fkey` FOREIGN KEY (`shippingSetId`) REFERENCES `ShippingSet`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderShipping` ADD CONSTRAINT `OrderShipping_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE `OrderItemOption` ADD CONSTRAINT `OrderItemOption_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemOption` ADD CONSTRAINT `OrderItemOption_goodsOptionId_fkey` FOREIGN KEY (`goodsOptionId`) REFERENCES `GoodsOptions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemSupport` ADD CONSTRAINT `OrderItemSupport_broadcasterId_fkey` FOREIGN KEY (`broadcasterId`) REFERENCES `Broadcaster`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemSupport` ADD CONSTRAINT `OrderItemSupport_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemSupport` ADD CONSTRAINT `OrderItemSupport_productPromotionId_fkey` FOREIGN KEY (`productPromotionId`) REFERENCES `ProductPromotion`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItemSupport` ADD CONSTRAINT `OrderItemSupport_liveShoppingId_fkey` FOREIGN KEY (`liveShoppingId`) REFERENCES `LiveShopping`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE `Refund` ADD CONSTRAINT `Refund_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundItem` ADD CONSTRAINT `RefundItem_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundItem` ADD CONSTRAINT `RefundItem_orderItemOptionId_fkey` FOREIGN KEY (`orderItemOptionId`) REFERENCES `OrderItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefundItem` ADD CONSTRAINT `RefundItem_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Return` ADD CONSTRAINT `Return_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Return` ADD CONSTRAINT `Return_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;


-- AddForeignKey
ALTER TABLE `ReturnItem` ADD CONSTRAINT `ReturnItem_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnItem` ADD CONSTRAINT `ReturnItem_orderItemOptionId_fkey` FOREIGN KEY (`orderItemOptionId`) REFERENCES `OrderItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnItem` ADD CONSTRAINT `ReturnItem_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `Return`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exchange` ADD CONSTRAINT `Exchange_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Exchange` ADD CONSTRAINT `Exchange_exportId_fkey` FOREIGN KEY (`exportId`) REFERENCES `Export`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExchangeItem` ADD CONSTRAINT `ExchangeItem_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExchangeItem` ADD CONSTRAINT `ExchangeItem_orderItemOptionId_fkey` FOREIGN KEY (`orderItemOptionId`) REFERENCES `OrderItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExchangeItem` ADD CONSTRAINT `ExchangeItem_exchangeId_fkey` FOREIGN KEY (`exchangeId`) REFERENCES `Exchange`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCancellation` ADD CONSTRAINT `OrderCancellation_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCancellation` ADD CONSTRAINT `OrderCancellation_refundId_fkey` FOREIGN KEY (`refundId`) REFERENCES `Refund`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCancellationItem` ADD CONSTRAINT `OrderCancellationItem_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCancellationItem` ADD CONSTRAINT `OrderCancellationItem_orderItemOptionId_fkey` FOREIGN KEY (`orderItemOptionId`) REFERENCES `OrderItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCancellationItem` ADD CONSTRAINT `OrderCancellationItem_orderCancellationId_fkey` FOREIGN KEY (`orderCancellationId`) REFERENCES `OrderCancellation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_sellerId_fkey` FOREIGN KEY (`sellerId`) REFERENCES `Seller`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_sellerSettlementsId_fkey` FOREIGN KEY (`sellerSettlementsId`) REFERENCES `SellerSettlements`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Export` ADD CONSTRAINT `Export_broadcasterSettlementItemsId_fkey` FOREIGN KEY (`broadcasterSettlementItemsId`) REFERENCES `BroadcasterSettlementItems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportItem` ADD CONSTRAINT `ExportItem_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportItem` ADD CONSTRAINT `ExportItem_orderItemOptionId_fkey` FOREIGN KEY (`orderItemOptionId`) REFERENCES `OrderItemOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExportItem` ADD CONSTRAINT `ExportItem_exportId_fkey` FOREIGN KEY (`exportId`) REFERENCES `Export`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsCategory` ADD CONSTRAINT `GoodsCategory_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `GoodsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GoodsCategory` ADD CONSTRAINT `GoodsCategory_informationSubjectId_fkey` FOREIGN KEY (`informationSubjectId`) REFERENCES `GoodsInformationSubject`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoodsToGoodsCategory` ADD FOREIGN KEY (`A`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoodsToGoodsCategory` ADD FOREIGN KEY (`B`) REFERENCES `GoodsCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LikedReviews` ADD FOREIGN KEY (`A`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_LikedReviews` ADD FOREIGN KEY (`B`) REFERENCES `GoodsReview`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToLiveShopping` ADD FOREIGN KEY (`A`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CustomerToLiveShopping` ADD FOREIGN KEY (`B`) REFERENCES `LiveShopping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToGoods` ADD FOREIGN KEY (`A`) REFERENCES `Coupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CouponToGoods` ADD FOREIGN KEY (`B`) REFERENCES `Goods`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReturnImage` ADD CONSTRAINT `ReturnImage_returnId_fkey` FOREIGN KEY (`returnId`) REFERENCES `Return`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExchangeImage` ADD CONSTRAINT `ExchangeImage_exchangeId_fkey` FOREIGN KEY (`exchangeId`) REFERENCES `Exchange`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ************************************************************************************
-- 기본값 구성
-- GoodsCategory 초기더미데이터 추가
INSERT INTO `GoodsCategory` (`id`, `categoryCode`, `name`, `mainCategoryFlag`, `parentCategoryId`)
VALUES
	(1, '3OODwX2OsE8nUeu79ca59', '간편식/밀키트', 1, NULL),
	(2, 'KUr9dvph5fj5D3DL8yho9', '구이/조림.볶음', 0, 1),
	(3, 'cablIPmpwaBiyKfCKDd_L', '국/탕/찌개', 0, 1),
	(4, 'b-0sqerAdOBJ464uNH2R4', '에어프라이 조리', 0, 1),
	(5, 'mZG_DLtuJWpK9vO1V9pkm', '전자레인지 조리', 0, 1),
	(6, '_IGJGLoiep3kDtAXR5sez', '만두/튀김', 0, 1),
	(7, 'hcv1ikRITzKppia-6b5nn', '한식', 0, 1),
	(8, 'q7hHGLnrdivMtmAG0nZxy', '양식', 0, 1),
	(9, '4bAH23CrgZ7xP1oAs2C0I', '중식', 0, 1),
	(10, '8_ICTMpESlc4XXKBQdSE8', '반찬/조미료', 1, NULL),
	(11, 'Hzci_ng5v9SywavsE5WzO', '김치', 0, 10),
	(12, 'ODmmbG17fkpWBvJS44cDz', '천연조미료/오일', 0, 10),
	(13, '7-wlAhcqQj-pAY8EsHZ72', '젓갈', 0, 10),
	(14, 'Y0UhII4ELTwhdi5Fkw6c2', '건강식', 1, NULL),
	(15, 'oIA7PeZ4M6nrjVHgdSSYs', '샐러드 키트', 0, 14),
	(16, 'EXlXcEfmaWcPSc-q5BVMm', '고단백', 0, 14),
	(17, '4E4TiC8NytOvk29Rq8KFX', '저탄고지', 0, 14),
	(18, 'uknVdH_lwnmJrIOf4HIio', '견과류', 0, 14),
	(19, 'LXKbWJQkQgQKGLeifzPTN', '신선과즙', 0, 14),
	(20, 'bFJ7wnqOAuWfN3RmAfhAQ', '저칼로리', 0, 14),
	(21, 'VP07hyfPH0ZwVINGG_94b', '다이어트', 1, NULL),
	(22, '기타', '기타', 1, NULL);

INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("가공식품", '{"식품의 유형": "","생산자 및 소재지, 수입품의 경우 생산자, 수입자 및 제조국 함께 표기": "","제조연월일, 유통기한 또는 품질유지기한": "","포장단위별 내용물의 용량(중량), 수량": "","원재료명 및 함량": "","영양성분(식품 등의 표시·광고에 관한 법률에 따른 영양성분 표시대상 식품에 한함)": "","유전자변형식품에 해당하는 경우의 표시": "","수입식품에 해당하는 경우 “수입식품안전관리특별법에 따른 수입신고를 필함”의 문구": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)","제품명": "","소비자안전을 위한 주의사항": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("의류", '{"제품소재": "","색상": "","치수": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","세탁방법 및 취급시 주의사항": "","제조년월": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("구두/신발", '{"제품 주소재": "","색상": "","치수": "","제조자": "","제조국": "","취급시 주의사항": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("가방", '{"종류": "","소재": "","색상": "","크기": "","제조자, 수입품의 경우 수입자를 함께 표기": "","제조국": "","취급 시 주의사항": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("패션잡화(모자/벨트/액세서리)", '{"종류": "","소재": "","치수": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","취급시 주의사항": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("침구류/커튼", '{"제품소재": "","색상": "","치수": "","제품구성": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","세탁방법 및 취급시 주의사항": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("가구(침대/소파/싱크대/DIY제품)", '{"품명": "","KC 인증 필 유무": "","색상": "","구성품": "","주요소재": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기": "","배송/설치 비용": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("영상가전(TV류)", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","에너지소비효율등급": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기": "","화면사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("가정용 전기제품(냉장고/세탁기/식기세척기/전자레인지)", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","에너지소비효율등급": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("계절가전(에어컨/온풍기)", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","에너지소비효율등급": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기": "","냉난방면적": "","추가설치비용": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("사무용기기(컴퓨터/노트북/프린터)", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","에너지소비효율등급": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기, 무게": "","주요사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("광학기기(디지털카메라/캠코더)", '{"품명 및 모델명": "","KC 인증 필 유무": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기, 무게 ": "","주요사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("소형전자(MP3/전자사전 등)", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기, 무게": "","주요사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("휴대폰", '{"품명 및 모델명": "","KC 인증 필 유무": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기, 무게 ": "","이동통신사": "","가입절차": "","소비자의 추가적인 부담사항": "","주요사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("내비게이션", '{"품명 및 모델명": "","KC 인증 필 유무": "","정격전압,소비전력": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기, 무게 ": "","주요사양": "","맵 업데이트 비용 및 무상기간": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("자동차용품(자동차부품,기타 자동차용품)", '{"품명 및 모델명": "","동일모델의 출시년월": "","자동차관리법에 따른 자동차부품 자기인증 유무": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","크기": "","적용차종": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)","제품사용으로 인한 위험 및 유의사항(연료절감장치에한함)": "","검사합격증 번호": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("의료기기", '{"품명 및 모델명": "","의료기기법상 허가,신고 번호": "","정격전압, 소비전력": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","제품의 사용목적 및 사용방법": "","취급시 주의사항": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("주방용품", '{"품명 및 모델명": "","재질": "","구성품": "","크기": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","수입식품안전관리특별법에 따른 수입 기구·용기의 경우 “수입식품안전관리특별법에 따른 수입신고를 필함”의 문구": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("화장품", '{"용량 및 중량": "","제품 주요 사양": "","사용기한 또는 개봉 후 사용기간": "","사용방법": "","화장품제조업자 및 화장품책임판매업자": "","제조국": "","화장품법에 따라 기재,표시하여야 하는 모든성분": "","기능성 화장품의 경우 화장품법에 따른 식품의약안전청 심사 필 유무": "","사용할 때 주의사항": "","품질보증기준": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("귀금속/보석/시계류", '{"소재/순도/밴드재질": "","중량": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","치수": "","착용시 주의사항": "","귀금속,보석류-등급": "","시계-기능,방수": "","보증서 제공여부": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("식품(농수축산물)", '{"포장단위별 내용물의 용량(중량), 수량, 크기": "","생산자,수입품의 경우 수입자를 함께 표기": "","농수산물의 원산지 표시에 관한 법률에 따른 원산지": "","제조연월일(포장일 또는 생산연도), 유통기한": "","농산물-농산물품질관리법상 유전자변형농산물 표시, 지리적표시": "","축산물 – 축산법에 따른 등급 표시, 축산물이력법에 따른 이력관리대상축산물 유무": "","수산물-수산물품질관리법상 유전자변형수산물 표시, 지리적표시": "","수입식품에 해당하는 경우 “수입식품안전관리특별법에 따른 수입신고를 필함”의 문구": "","상품구성": "","보관방법 또는 취급방법": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)","품목 또는 명칭": "","식품 등의 표시·광고에 관한 법률에 따른 소비자안전을 위한 주의사항": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("건강기능식품", '{"식품의 유형": "","제조업소의 명칭과 소재지(수입품의 경우 수입업소명, 제조업소명 및 수출국명)": "","제조연월일, 유통기한": "","포장단위별 내용물의 용량(중량), 수량": "","원재료명 및 함량": "","영양정보": "","기능정보": "","섭취량,섭취방법 및 섭취시 주의사항 및 부작용 가능성": "","질병의 예방 및 치료를 위한 의약품이 아니라는 내용의 표현": "","유전자변형건강기능식품에 해당하는 경우의 표시": "","수입식품에 해당하는 경우 “수입식품안전관리특별법에 따른 수입신고를 필함”의 문구": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)","제품명": "","소비자안전을 위한 주의사항": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("영유아용품", '{"품명 및 모델명": "","어린이제품 안전 특별법 상 안전인증대상어린이제품, 안전확인대상어린이제품,공급자적합성 확인대상어린이제품에 대한 KC 인증 필 유무": "","크기, 중량 ": "","색상": "","재질": "","사용연령 또는 체중범위": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","취급방법 및 취급시 주의사항, 안전표시": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("악기", '{"품명 및 모델명": "","크기": "","색상": "","재질": "","제품구성": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","상품별 세부 사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("스포츠용품", '{"품명 및 모델명": "","크기, 중량 ": "","색상": "","재질": "","제품 구성": "","동일모델의 출시년월": "","제조자,수입품의 경우 수입자를 함께 표기": "","제조국": "","상품별 세부 사양": "","품질보증기준": "","AS책임자와 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("서적", '{"도서명": "","저자, 출판사": "","크기 ": "","쪽수": "","제품구성": "","출간일": "","목차 또는 책소개": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("호텔/펜션 예약", '{"국가 또는 지역명": "","숙소형태": "","등급, 객실타입": "","사용가능 인원, 인원 추가시 비용": "","부대시설, 제공서비스": "","취소규정": "","예약담당 연락처": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("여행패키지", '{"여행사": "","이용항공편": "","여행기간 및 일정": "","총 예정 인원, 출발 가능 인원": "","숙박정보": "","여행상품 가격": "","선택경비 유무 등": "","선택관광 및 대체일정": "","가이드 팁": "","취소규정": "","해외여행의 경우 외교통상부가 지정하는 여행경보단계": "","예약담당 연락처": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("항공권", '{"요금조건, 왕복,편도 여부": "","유효기간": "","제한사항": "","티켓수령방법": "","좌석종류": "","추가 경비 항목과 금액": "","취소규정": "","예약담당 연락처": ""}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("자동차 대여 서비스(렌터카)", '{"차종": "","소유권 이전 조건": "","추가 선택시 비용": "","차량 반환시 연료대금 정산방법": "","차량의 고장,훼손시 소비자 책임": "","예약 취소 또는 중도 해약시 환불 기준": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("물품대여 서비스(정수기,비데,공기청정기 등)", '{"품명 및 모델명": "","소유권 이전 조건": "","유지보수 조건": "","상품의 고장,분실,훼손시 소비자 책임": "","중도 해약시 환불 기준": "","제품사양": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("물품대여 서비스(서적,유아용품,행사용품 등)", '{"품명 및 모델명": "","소유권 이전 조건": "","상품의 고장,분실,훼손시 소비자 책임": "","중도 해약시 환불 기준": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("디지털 콘텐츠(음원,게임,인터넷강의 등)", '{"제작자 또는 공급자": "","이용조건, 이용기간": "","상품제공방식": "","최소시스템사양, 필수 소프트웨어": "","청약철회 또는 계약의 해제,해지에 따른 효과": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("상품권/쿠폰", '{"발행자": "","유효기간, 이용조건 (이용방법 - 이용조건##유효기간)": "","이용 가능 매장": "","잔액 환급 조건": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("모바일 쿠폰", '{"발행자": "","유효기간, 이용조건": "","이용 가능 매장": "","환불조건 및 방법": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("영화, 공연", '{"주최 또는 기획": "","주연": "","관람등급": "","상영,공연시간": "","상영,공연장소": "","예매취소 조건": "","취소환불방법": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("기타 용역", '{"서비스 제공 사업자": "","법에 의한 인증,허가 등을 받았음을 확인할수 있는 경우 그에 대한 사항": "","이용조건": "","취소,중도해약,해지 조건 및 환불기준": "","취소,환불방법": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("기타 재화", '{"품명 및 모델명": "","법에 의한 인증,허가 등을 받았음을 확인할수 있는 경우 그에 대한 사항": "","제조국 또는 원산지": "","제조자,수입품의 경우 수입자를 함께 표기": "","AS책임자와 전화번호 또는 소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("생활화학제품", '{"품목 및 제품명": "","용도(표백제의 경우 계열을 함께 표시) 및 제형": "","제조연월 및 유통기한(해당 없는 제품 생략 가능)": "","중량․용량․매수": "","효과․효능(승인대상 제품에 한함)": "","수입자(수입제품에 한함), 제조국 및 제조사": "","어린이 보호포장 대상 제품 유무": "","제품에 사용된 화학물질 명칭(주요물질, 보존제 등 관련 고시에 따른 표시의무 화학물질에 한함)": "","사용상 주의사항": "","안전기준 적합확인 신고번호(자가검사번호) 또는 안전확인대상 생활화학제품 승인번호": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');
INSERT INTO `GoodsInformationSubject` (`subject`, `items`) VALUES ("살생물제품", '{"제품명 및 제품유형": "","중량 또는 용량 및 표준사용량": "","효과․효능": "","사용대상자 및 사용범위": "","수입자(수입제품에 한함), 제조국 및 제조사": "","어린이보호포장 대상제품 유무": "","살생물물질, 나노물질, 기타 화학물질(유해화학물질 또는 중점관리물질)의 명칭": "","제품 유해성․위해성 표시": "","사용방법 및 사용상 주의사항": "","승인번호": "","소비자상담 관련 전화번호": "크크쇼 고객센터(051-515-6309)"}');

UPDATE `GoodsCategory` SET `informationSubjectId` = 1 WHERE `name` IN (
    '간편식/밀키트',
    '구이/조림.볶음',
    '국/탕/찌개',
    '에어프라이 조리',
    '전자레인지 조리',
    '만두/튀김',
    '한식',
    '양식',
    '중식',
    '반찬/조미료',
    '김치',
    '천연조미료/오일',
    '젓갈',
    '건강식',
    '샐러드 키트',
    '고단백',
    '저탄고지',
    '견과류',
    '신선과즙',
    '저칼로리',
    '다이어트'
);