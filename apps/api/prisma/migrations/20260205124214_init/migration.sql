-- CreateEnum
CREATE TYPE "ScanResult" AS ENUM ('OK', 'WRONG');

-- CreateTable
CREATE TABLE "ProductionOrder" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "orderNumber" TEXT NOT NULL,
    "description" TEXT,
    "plannedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeComponent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "componentCode" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "requiredQty" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "unit" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecipeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComponentBatch" (
    "id" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "qrCode" TEXT NOT NULL,
    "batchNumber" TEXT,
    "lotNumber" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComponentBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScanEvent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "batchId" TEXT,
    "scannedQr" TEXT NOT NULL,
    "result" "ScanResult" NOT NULL,
    "scannedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deviceId" TEXT,
    "operatorId" TEXT,
    "notes" TEXT,

    CONSTRAINT "ScanEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_externalId_key" ON "ProductionOrder"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionOrder_orderNumber_key" ON "ProductionOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "ProductionOrder_orderNumber_idx" ON "ProductionOrder"("orderNumber");

-- CreateIndex
CREATE INDEX "RecipeComponent_orderId_idx" ON "RecipeComponent"("orderId");

-- CreateIndex
CREATE INDEX "RecipeComponent_componentCode_idx" ON "RecipeComponent"("componentCode");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeComponent_orderId_componentCode_key" ON "RecipeComponent"("orderId", "componentCode");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentBatch_qrCode_key" ON "ComponentBatch"("qrCode");

-- CreateIndex
CREATE INDEX "ComponentBatch_componentId_idx" ON "ComponentBatch"("componentId");

-- CreateIndex
CREATE INDEX "ScanEvent_orderId_idx" ON "ScanEvent"("orderId");

-- CreateIndex
CREATE INDEX "ScanEvent_componentId_idx" ON "ScanEvent"("componentId");

-- CreateIndex
CREATE INDEX "ScanEvent_batchId_idx" ON "ScanEvent"("batchId");

-- CreateIndex
CREATE INDEX "ScanEvent_scannedAt_idx" ON "ScanEvent"("scannedAt");

-- AddForeignKey
ALTER TABLE "RecipeComponent" ADD CONSTRAINT "RecipeComponent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComponentBatch" ADD CONSTRAINT "ComponentBatch_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "RecipeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "RecipeComponent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ComponentBatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
