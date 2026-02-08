import type { StudentsRepository } from '../repositories/students.repository';
import { StudentDocumentsRepository } from '../../student-documents/repositories/students-documents.repository';
import type { GENDER } from '@/generated/prisma/enums';
import type { Student } from '@/generated/prisma/client';
import { StudentAlreadyExistsError } from '../errors/student-already-exists.error';
import { DocumentAlreadyExistsError } from '../errors/studen-document-already-exists.error';

interface CreateStudentReques {
  name: string;
  registrationNumber: string;
  dateOfBirth: Date;
  gender: GENDER;

  document: {
    documentTypeId: string;
    documentNumber: string;
    documentUrl?: string | null;
  };
}

export class CreateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private StudentDocumentsRepository: StudentDocumentsRepository,
  ) {}

  async execute(data: CreateStudentReques, schoolId: string): Promise<Student> {
    const studentExists =
      await this.studentsRepository.findByRegistrationNumber(
        data.registrationNumber,
        schoolId,
      );

    if (studentExists) {
      throw new StudentAlreadyExistsError();
    }

    const documentExists =
      await this.StudentDocumentsRepository.findTypeAndNumber(
        data.document.documentTypeId,
        data.document.documentNumber,
        schoolId,
      );

    if (documentExists) {
      throw new DocumentAlreadyExistsError();
    }

    const student = await this.studentsRepository.save({
      name: data.name,
      registrationNumber: data.registrationNumber,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      schoolId,
    });

    await this.StudentDocumentsRepository.create({
      studentId: student.id,
      documentTypeId: data.document.documentTypeId,
      documentNumber: data.document.documentNumber,
      fileUrl: data.document.documentUrl,
      schoolId,
    });

    return student;
  }
}
