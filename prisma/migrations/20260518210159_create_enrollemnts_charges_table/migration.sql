-- CreateEnum
CREATE TYPE "CHARGE_STATUS" AS ENUM ('PENDING', 'INVOICED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "enrollment_charges" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "feeTypeId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "referenceYear" INTEGER NOT NULL,
    "referenceMonth" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "baseAmount" DECIMAL(10,2) NOT NULL,
    "penaltyAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "paidAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "balanceAmount" DECIMAL(10,2) NOT NULL,
    "status" "CHARGE_STATUS" NOT NULL DEFAULT 'PENDING',
    "schoolId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "enrollment_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "enrollment_charges_schoolId_academicYearId_status_idx" ON "enrollment_charges"("schoolId", "academicYearId", "status");

-- CreateIndex
CREATE INDEX "enrollment_charges_schoolId_referenceYear_referenceMonth_idx" ON "enrollment_charges"("schoolId", "referenceYear", "referenceMonth");

-- CreateIndex
CREATE UNIQUE INDEX "enrollment_charges_enrollmentId_feeTypeId_referenceYear_ref_key" ON "enrollment_charges"("enrollmentId", "feeTypeId", "referenceYear", "referenceMonth");

-- AddForeignKey
ALTER TABLE "enrollment_charges" ADD CONSTRAINT "enrollment_charges_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_charges" ADD CONSTRAINT "enrollment_charges_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "fee_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_charges" ADD CONSTRAINT "enrollment_charges_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment_charges" ADD CONSTRAINT "enrollment_charges_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
