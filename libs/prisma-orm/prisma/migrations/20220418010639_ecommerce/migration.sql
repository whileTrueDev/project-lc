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
    `shippingCost` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `shippingCostIncluded` BOOLEAN NOT NULL DEFAULT false,
    `shippingGroupId` INTEGER NOT NULL,
    `channel` ENUM('liveShopping', 'productPromotion', 'normal') NOT NULL DEFAULT 'normal',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CartItemOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cartItemId` INTEGER NOT NULL,
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
    `createDate` DATETIME(3) NOT NULL,
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
    `createDate` DATETIME(3) NOT NULL,
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
    `createDate` DATETIME(3) NOT NULL,
    `writerId` INTEGER NOT NULL,
    `goodsId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GoodsInquiryComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `createDate` DATETIME(3) NOT NULL,
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
    `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived',
    `createDate` DATETIME(3) NOT NULL,
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

    UNIQUE INDEX `OrderPayment_orderId_key`(`orderId`),
    UNIQUE INDEX `OrderPayment_paymentKey_key`(`paymentKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `goodsId` INTEGER NULL,
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
    `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived',
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
    `memo` VARCHAR(191) NOT NULL,
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
    `rejectReason` VARCHAR(191) NULL,
    `returnAddress` VARCHAR(191) NOT NULL,
    `responsibility` VARCHAR(191) NOT NULL,
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
CREATE TABLE `Exchange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exchangeCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('requested', 'collected', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completeDate` DATETIME(3) NULL,
    `reason` VARCHAR(191) NOT NULL,
    `rejectReason` VARCHAR(191) NULL,
    `returnAddress` VARCHAR(191) NOT NULL,
    `responsibility` VARCHAR(191) NOT NULL,
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
CREATE TABLE `OrderCancellation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cancelCode` VARCHAR(191) NULL,
    `orderId` INTEGER NOT NULL,
    `status` ENUM('requested', 'processing', 'complete', 'canceled') NOT NULL DEFAULT 'requested',
    `requestDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `completeDate` DATETIME(3) NULL,
    `reason` VARCHAR(191) NULL,
    `rejectReason` VARCHAR(191) NULL,
    `responsibility` VARCHAR(191) NOT NULL,
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
    `goodsId` INTEGER NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX `Goods_informationNoticeId_key` ON `Goods`(`informationNoticeId`);

-- AddForeignKey
ALTER TABLE `SellerSettlementItems` ADD CONSTRAINT `SellerSettlementItems_relatedOrderId_fkey` FOREIGN KEY (`relatedOrderId`) REFERENCES `Order`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goods` ADD CONSTRAINT `Goods_informationNoticeId_fkey` FOREIGN KEY (`informationNoticeId`) REFERENCES `GoodsInformationNotice`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE `CustomerCoupon` ADD CONSTRAINT `CustomerCoupon_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `Coupon`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerCouponLog` ADD CONSTRAINT `CustomerCouponLog_customerCouponId_fkey` FOREIGN KEY (`customerCouponId`) REFERENCES `CustomerCoupon`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_goodsId_fkey` FOREIGN KEY (`goodsId`) REFERENCES `Goods`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_shippingGroupId_fkey` FOREIGN KEY (`shippingGroupId`) REFERENCES `ShippingGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItem` ADD CONSTRAINT `CartItem_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CartItemOption` ADD CONSTRAINT `CartItemOption_cartItemId_fkey` FOREIGN KEY (`cartItemId`) REFERENCES `CartItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE `GoodsCategory` ADD CONSTRAINT `GoodsCategory_parentCategoryId_fkey` FOREIGN KEY (`parentCategoryId`) REFERENCES `GoodsCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
