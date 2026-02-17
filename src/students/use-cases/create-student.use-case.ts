import { StudentsRepository } from '../repositories/students.repository';
import { StudentDocumentsRepository } from '../../student-documents/repositories/students-documents.repository';
import type { GENDER } from '@/generated/prisma/enums';
import type { Student } from '@/generated/prisma/client';
import { StudentAlreadyExistsError } from '../errors/student-already-exists.error';
import { StudentWithSameDocumentAlreadyExistsError } from '../errors/student-document-already-exists.error';
import { StudentMustHaveDocumentError } from '../errors/student-must-have-document.error';
import { Injectable } from '@nestjs/common';
import type { DbContext } from '@/prisma/shared/db-context';

export interface CreateStudentRequest {
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

@Injectable()
export class CreateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private StudentDocumentsRepository: StudentDocumentsRepository,
  ) {}

  async execute(
    data: CreateStudentRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<Student> {
    const studentExists =
      await this.studentsRepository.findByRegistrationNumber(
        data.registrationNumber,
        schoolId,
        db,
      );

    if (studentExists) {
      throw new StudentAlreadyExistsError();
    }

    if (!data.document) {
      throw new StudentMustHaveDocumentError();
    }

    const documentExists =
      await this.StudentDocumentsRepository.findTypeAndNumber(
        data.document.documentTypeId,
        data.document.documentNumber,
        schoolId,
      );

    if (documentExists) {
      throw new StudentWithSameDocumentAlreadyExistsError();
    }

    const student = await this.studentsRepository.save(
      {
        name: data.name,
        registrationNumber: data.registrationNumber,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        schoolId,
      },
      db,
    );

    await this.StudentDocumentsRepository.save(
      {
        studentId: student.id,
        documentTypeId: data.document.documentTypeId,
        documentNumber: data.document.documentNumber,
        fileUrl: data.document.documentUrl,
        schoolId,
      },
      db,
    );

    return student;
  }
}
