-- AlterTable
ALTER TABLE `Order` MODIFY `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived';

-- AlterTable
ALTER TABLE `OrderItemOption` MODIFY `step` ENUM('orderReceived', 'paymentConfirmed', 'goodsReady', 'partialExportReady', 'exportReady', 'partialExportDone', 'exportDone', 'partialShipping', 'shipping', 'partialShippingDone', 'shippingDone', 'purchaseConfirmed', 'paymentCanceled', 'orderInvalidated', 'paymentFailed') NOT NULL DEFAULT 'orderReceived';
