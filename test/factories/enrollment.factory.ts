import type { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

type EnrollmentFactoryOverrides = Partial<{
  studentId: string;
  classroomId: string;
  academicYearId: string;
  schoolId: string;
  status: ENROLLMENT_STATUS;
}>;

export function enrollmentFactory(overrides: EnrollmentFactoryOverrides = {}) {
  return {
    studentId: overrides.studentId ?? faker.string.uuid(),
    classroomId: overrides.classroomId ?? faker.string.uuid(),
    academicYearId: overrides.academicYearId ?? faker.string.uuid(),
    schoolId: overrides.schoolId ?? faker.string.uuid(),
    status: overrides.status,
  };
}
