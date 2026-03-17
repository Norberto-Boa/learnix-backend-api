-- CreateEnum
CREATE TYPE "FEE_TYPE_CATEGORY" AS ENUM ('NORMAL', 'PENALTY');

-- CreateEnum
CREATE TYPE "FEE_SCOPE" AS ENUM ('SCHOOL', 'GRADE');

-- CreateTable
CREATE TABLE "fee_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "category" "FEE_TYPE_CATEGORY" NOT NULL DEFAULT 'NORMAL',
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "fee_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fee_types_schoolId_code_key" ON "fee_types"("schoolId", "code");

-- AddForeignKey
ALTER TABLE "fee_types" ADD CONSTRAINT "fee_types_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
