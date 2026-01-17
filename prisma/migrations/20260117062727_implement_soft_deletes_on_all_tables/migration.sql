-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "STATUS" NOT NULL DEFAULT 'ACTIVE';
