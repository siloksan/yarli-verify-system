/*
  Warnings:

  - You are about to drop the column `componentName` on the `Bucket` table. All the data in the column will be lost.
  - Added the required column `componentId` to the `Bucket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bucket" DROP COLUMN "componentName",
ADD COLUMN     "componentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Bucket" ADD CONSTRAINT "Bucket_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE CASCADE ON UPDATE CASCADE;
