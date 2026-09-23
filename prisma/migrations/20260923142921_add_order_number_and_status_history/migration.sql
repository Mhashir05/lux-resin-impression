-- AlterTable: added nullable first so existing rows can be backfilled below,
-- since NOT NULL can't be applied directly to a column with existing rows.
ALTER TABLE "Order" ADD COLUMN     "orderNumber" TEXT;

-- Backfill: orders placed before order numbers existed get a distinct legacy
-- number derived from their id, matching the short-id format already shown
-- for these orders elsewhere in the admin UI (see lib/orders.ts shortOrderId).
UPDATE "Order" SET "orderNumber" = 'LEGACY-' || UPPER(SUBSTRING("id", 1, 8)) WHERE "orderNumber" IS NULL;

ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
