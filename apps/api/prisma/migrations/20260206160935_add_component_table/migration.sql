/*
  Warnings:

  - Made the column `batchNumber` on table `ComponentBatch` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ComponentBatch" DROP CONSTRAINT "ComponentBatch_componentId_fkey";

-- AlterTable
ALTER TABLE "ComponentBatch" ALTER COLUMN "batchNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecipeComponent" ADD COLUMN     "validBatches" TEXT[];

-- CreateTable
CREATE TABLE "Component" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Component_code_key" ON "Component"("code");

-- AddForeignKey
ALTER TABLE "ComponentBatch" ADD CONSTRAINT "ComponentBatch_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
