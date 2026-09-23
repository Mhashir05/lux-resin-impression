-- AlterTable
ALTER TABLE "SafepayPendingTracker"
    ADD COLUMN     "customerName" TEXT NOT NULL,
    ADD COLUMN     "phone" TEXT NOT NULL,
    ADD COLUMN     "address" TEXT NOT NULL,
    ADD COLUMN     "items" JSONB NOT NULL;
