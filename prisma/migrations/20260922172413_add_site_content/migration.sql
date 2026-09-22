-- CreateTable
CREATE TABLE "SiteContent" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");
