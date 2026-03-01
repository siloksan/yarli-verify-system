-- AlterTable
ALTER TABLE "ScanEvent" ADD COLUMN     "bucketId" TEXT,
ALTER COLUMN "scannedCode" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ScanEvent" ADD CONSTRAINT "ScanEvent_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
