import { GENDER, STUDENT_STATUS } from '@/generated/prisma/enums';
import { faker } from '@faker-js/faker';

export type StudentFactoryOverrides = Partial<{
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;
  status: STUDENT_STATUS;
  schoolId: string;
  document: {
    documentTypeId: string;
    documentNumber: string;
  };
}>;

export function studentFactory(overides: StudentFactoryOverrides = {}) {
  return {
    name: overides.name ?? faker.person.fullName(),
    registrationNumber:
      overides.registrationNumber ?? faker.string.alphanumeric(6),
    dateOfBirth: overides.dateOfBirth ?? faker.date.past({ years: 10 }),
    gender: overides.gender ?? faker.helpers.enumValue(GENDER),
    schoolId: overides.schoolId ?? faker.string.uuid(),
    document: {
      documentTypeId: overides.document?.documentTypeId ?? faker.string.uuid(),
      documentNumber:
        overides.document?.documentNumber ?? faker.string.alphanumeric(9),
    },
  };
}
