-- AlterTable
ALTER TABLE "Cart" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN "deletedAt" DATETIME;
