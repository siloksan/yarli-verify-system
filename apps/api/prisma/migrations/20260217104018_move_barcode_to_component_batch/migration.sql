/*
  Warnings:

  - You are about to drop the column `barcode` on the `Component` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Component` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[barcode]` on the table `ComponentBatch` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[componentName]` on the table `RecipeComponent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barcode` to the `ComponentBatch` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Component_barcode_idx";

-- DropIndex
DROP INDEX "Component_barcode_key";

-- AlterTable
ALTER TABLE "Component" DROP COLUMN "barcode";

-- AlterTable
ALTER TABLE "ComponentBatch" ADD COLUMN     "barcode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Component_name_key" ON "Component"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ComponentBatch_barcode_key" ON "ComponentBatch"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeComponent_componentName_key" ON "RecipeComponent"("componentName");
