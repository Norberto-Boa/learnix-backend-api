import type { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export interface Enrollment {
  studentId: string;
  classroomId: string;
  academicYearId: string;
  schoolId: string;
  status: ENROLLMENT_STATUS;
  enrolledAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
