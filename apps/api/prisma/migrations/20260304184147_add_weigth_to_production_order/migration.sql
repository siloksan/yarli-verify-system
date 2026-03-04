/*
  Warnings:

  - Added the required column `weight` to the `ProductionOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductionOrder" ADD COLUMN     "weight" DECIMAL(65,30) NOT NULL;
