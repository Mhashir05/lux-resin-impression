-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "courierBookedAt" TIMESTAMP(3),
ADD COLUMN     "courierService" TEXT,
ADD COLUMN     "riderName" TEXT,
ADD COLUMN     "riderPhone" TEXT,
ADD COLUMN     "trackingId" TEXT;
