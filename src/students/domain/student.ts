import type { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';

export interface Student {
  name: string;
  registrationNumber: string;
  dateOfBitrth: string;
  gender: GENDER;
  status: STUDENT_STATUS;
  schoolId: string;
}
