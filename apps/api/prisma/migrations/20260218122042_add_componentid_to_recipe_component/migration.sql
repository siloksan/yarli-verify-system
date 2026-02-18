-- AlterTable
ALTER TABLE "RecipeComponent" ADD COLUMN     "componentId" TEXT;

-- CreateIndex
CREATE INDEX "RecipeComponent_componentId_idx" ON "RecipeComponent"("componentId");

-- AddForeignKey
ALTER TABLE "RecipeComponent" ADD CONSTRAINT "RecipeComponent_componentId_fkey" FOREIGN KEY ("componentId") REFERENCES "Component"("id") ON DELETE SET NULL ON UPDATE CASCADE;
