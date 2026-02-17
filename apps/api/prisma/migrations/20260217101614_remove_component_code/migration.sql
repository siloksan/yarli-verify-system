/*
  Warnings:

  - You are about to drop the column `code` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ProductionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `ProductionOrder` table. All the data in the column will be lost.
  - You are about to drop the column `componentCode` on the `RecipeComponent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `Component` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Component_code_key";

-- DropIndex
DROP INDEX "ProductionOrder_externalId_key";

-- DropIndex
DROP INDEX "RecipeComponent_componentCode_idx";

-- DropIndex
DROP INDEX "RecipeComponent_orderId_componentCode_key";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "code",
DROP COLUMN "description",
ADD COLUMN     "barcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductionOrder" DROP COLUMN "description",
DROP COLUMN "externalId";

-- AlterTable
ALTER TABLE "RecipeComponent" DROP COLUMN "componentCode";

-- CreateTable
CREATE TABLE "Bucket" (
    "id" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "creator" TEXT NOT NULL,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bucket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FillingActBucket" (
    "id" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "componentBatch" TEXT NOT NULL,
    "workerName" TEXT NOT NULL,
    "weight" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bucketId" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "FillingActBucket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FillingActBucket_bucketId_idx" ON "FillingActBucket"("bucketId");

-- CreateIndex
CREATE INDEX "FillingActBucket_orderId_idx" ON "FillingActBucket"("orderId");

-- CreateIndex
CREATE INDEX "FillingActBucket_componentBatch_idx" ON "FillingActBucket"("componentBatch");

-- CreateIndex
CREATE UNIQUE INDEX "Component_barcode_key" ON "Component"("barcode");

-- CreateIndex
CREATE INDEX "Component_barcode_idx" ON "Component"("barcode");

-- AddForeignKey
ALTER TABLE "FillingActBucket" ADD CONSTRAINT "FillingActBucket_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillingActBucket" ADD CONSTRAINT "FillingActBucket_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FillingActBucket" ADD CONSTRAINT "FillingActBucket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
