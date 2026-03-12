import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export interface Enrollment {
  id: string;
  studentId: string;
  classroomId: string;
  academicYearId: string;
  schoolId: string;
  status: ENROLLMENT_STATUS;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const ACTIVE_ENROLLMENT_STATUSES: ENROLLMENT_STATUS[] = [
  ENROLLMENT_STATUS.PENDING,
  ENROLLMENT_STATUS.ACTIVE,
];
