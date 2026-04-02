-- CreateEnum
CREATE TYPE "PENALTY_MODE" AS ENUM ('FIXED', 'PERCENTAGE', 'INTERVAL_FIXED', 'INTERVAL_PERCENTAGE');

-- CreateTable
CREATE TABLE "penalty_policies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "triggerFeeTypeId" TEXT NOT NULL,
    "penaltyFeeTypeId" TEXT NOT NULL,
    "academicYearId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "gradeId" TEXT,
    "mode" "PENALTY_MODE" NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "graceDay" INTEGER NOT NULL,
    "intervalDays" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "penalty_policies_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "penalty_policies" ADD CONSTRAINT "penalty_policies_triggerFeeTypeId_fkey" FOREIGN KEY ("triggerFeeTypeId") REFERENCES "fee_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_policies" ADD CONSTRAINT "penalty_policies_penaltyFeeTypeId_fkey" FOREIGN KEY ("penaltyFeeTypeId") REFERENCES "fee_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_policies" ADD CONSTRAINT "penalty_policies_academicYearId_fkey" FOREIGN KEY ("academicYearId") REFERENCES "academic_years"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_policies" ADD CONSTRAINT "penalty_policies_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_policies" ADD CONSTRAINT "penalty_policies_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE SET NULL ON UPDATE CASCADE;
