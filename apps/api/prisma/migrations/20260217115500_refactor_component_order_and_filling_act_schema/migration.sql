/*
  Warnings:

  - You are about to drop the column `lotNumber` on the `ComponentBatch` table. All the data in the column will be lost.
  - You are about to drop the column `qrCodeData` on the `ComponentBatch` table. All the data in the column will be lost.
  - You are about to drop the column `scannedQr` on the `ScanEvent` table. All the data in the column will be lost.
  - Added the required column `scannedCode` to the `ScanEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "ComponentBatch_qrCodeData_key";

-- DropIndex
DROP INDEX "RecipeComponent_componentName_key";

-- AlterTable
ALTER TABLE "ComponentBatch" DROP COLUMN "lotNumber",
DROP COLUMN "qrCodeData";

-- AlterTable
ALTER TABLE "ScanEvent" DROP COLUMN "scannedQr",
ADD COLUMN     "scannedCode" TEXT NOT NULL;
