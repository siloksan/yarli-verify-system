-- DropForeignKey
ALTER TABLE "FillingActBucket" DROP CONSTRAINT "FillingActBucket_orderId_fkey";

-- AlterTable
ALTER TABLE "FillingActBucket" ALTER COLUMN "orderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "FillingActBucket" ADD CONSTRAINT "FillingActBucket_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "ProductionOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
