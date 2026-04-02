import type { PENALTY_MODE } from '@/generated/prisma/enums';

export interface PenaltyPolicyDomain {
  id: string;
  name: string;
  triggerFeeTypeId: string;
  penaltyFeeTypeId: string;
  academicYearId: string;
  gradeId: string | null;
  mode: PENALTY_MODE;
  value: number;
  graceDay: number;
  intervalDays: number | null;
  isActive: boolean;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
