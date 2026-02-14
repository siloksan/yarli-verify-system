/*
  Warnings:

  - A unique constraint covering the columns `[batchNumber]` on the table `ComponentBatch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `position` to the `RecipeComponent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeComponent" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ComponentBatch_batchNumber_key" ON "ComponentBatch"("batchNumber");
