/*
  Warnings:

  - You are about to drop the column `qrCode` on the `ComponentBatch` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[qrCodeData]` on the table `ComponentBatch` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ComponentBatch_qrCode_key";

-- AlterTable
ALTER TABLE "ComponentBatch" DROP COLUMN "qrCode",
ADD COLUMN     "qrCodeData" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ComponentBatch_qrCodeData_key" ON "ComponentBatch"("qrCodeData");
