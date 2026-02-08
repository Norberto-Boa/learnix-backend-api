import type { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';

export interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  dateOfBitrth: string;
  gender: GENDER;
  status: STUDENT_STATUS;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
