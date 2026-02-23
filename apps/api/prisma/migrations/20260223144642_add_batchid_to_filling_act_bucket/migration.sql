/*
  Warnings:

  - You are about to drop the column `componentBatch` on the `FillingActBucket` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `FillingActBucket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "FillingActBucket_componentBatch_idx";

-- AlterTable
ALTER TABLE "FillingActBucket" DROP COLUMN "componentBatch",
ADD COLUMN     "batchId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "FillingActBucket_batchId_idx" ON "FillingActBucket"("batchId");

-- AddForeignKey
ALTER TABLE "FillingActBucket" ADD CONSTRAINT "FillingActBucket_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "ComponentBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
