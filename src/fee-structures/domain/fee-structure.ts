import type { FEE_SCOPE } from "@/generated/prisma/enums";

export interface FeeStructureDomain {
  id: string;
  feeTypeId: string;
  scope: FEE_SCOPE;
  academicYearId: string;
  gradeId: string | null;
  amount: number;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}