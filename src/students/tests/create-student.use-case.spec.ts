import { InMemoryStudentDocumentsRepository } from '@/student-documents/repositories/in-memory-student-documents.repository';
import { InMemoryStudentsRepository } from '../repositories/in-memory/in-memory-students.repository';
import type {
  CreateStudentsData,
  StudentsRepository,
} from '../repositories/students.repository';
import {
  CreateStudentUseCase,
  type CreateStudentRequest,
} from '../use-cases/create-student.use-case';
import { studentFactory } from '@test/e2e/factories/student.factory';
import { StudentAlreadyExistsError } from '../errors/student-already-exists.error';
import { StudentWithSameDocumentAlreadyExistsError } from '../errors/student-document-already-exists.error';

describe('CreateStudentUseCase', () => {
  let studentsRepository: InMemoryStudentsRepository;
  let documentsRepository: InMemoryStudentDocumentsRepository;
  let useCase: CreateStudentUseCase;
  let fakeStudent: CreateStudentRequest;

  const auditContext = {};

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    documentsRepository = new InMemoryStudentDocumentsRepository();

    useCase = new CreateStudentUseCase(studentsRepository, documentsRepository);

    fakeStudent = studentFactory({
      registrationNumber: 'REG-001',
      schoolId: 'school-123',
    });
  });

  it('creates a student with a document', async () => {
    const student = await useCase.execute(
      {
        name: fakeStudent.name,
        registrationNumber: 'REG-001',
        dateOfBirth: fakeStudent.dateOfBirth,
        gender: fakeStudent.gender,
        document: {
          documentNumber: fakeStudent.document?.documentNumber,
          documentTypeId: fakeStudent.document?.documentTypeId,
        },
      },
      'school-123',
    );

    expect(student.id).toBeDefined();
    expect(studentsRepository.items).toHaveLength(1);
    expect(documentsRepository.items).toHaveLength(1);
  });

  it('Does not allow duplicate student registration number', async () => {
    await useCase.execute(
      {
        name: fakeStudent.name,
        registrationNumber: 'REG-001',
        dateOfBirth: fakeStudent.dateOfBirth,
        gender: fakeStudent.gender,
        document: {
          documentNumber: fakeStudent.document?.documentNumber,
          documentTypeId: fakeStudent.document?.documentTypeId,
        },
      },
      'school-123',
    );

    const fakeStudentduplicate = studentFactory({
      registrationNumber: 'REG-001',
      schoolId: 'school-123',
    });

    await expect(() =>
      useCase.execute(
        {
          name: fakeStudentduplicate.name,
          registrationNumber: 'REG-001',
          dateOfBirth: fakeStudentduplicate.dateOfBirth,
          gender: fakeStudentduplicate.gender,
          document: {
            documentNumber: fakeStudentduplicate.document?.documentNumber,
            documentTypeId: fakeStudentduplicate.document?.documentTypeId,
          },
        },
        'school-123',
      ),
    ).rejects.toBeInstanceOf(StudentAlreadyExistsError);
  });

  it('Does not allow duplicate document number to same type', async () => {
    await useCase.execute(
      {
        name: fakeStudent.name,
        registrationNumber: 'REG-001',
        dateOfBirth: fakeStudent.dateOfBirth,
        gender: fakeStudent.gender,
        document: {
          documentNumber: '123456789',
          documentTypeId: 'BI',
        },
      },
      'school-123',
    );

    const fakeStudentduplicate = studentFactory({
      schoolId: 'school-123',
      document: {
        documentNumber: '123456789',
        documentTypeId: 'BI',
      },
    });

    await expect(() =>
      useCase.execute(
        {
          name: fakeStudentduplicate.name,
          registrationNumber: fakeStudentduplicate.registrationNumber,
          dateOfBirth: fakeStudentduplicate.dateOfBirth,
          gender: fakeStudentduplicate.gender,
          document: {
            documentNumber: fakeStudentduplicate.document?.documentNumber,
            documentTypeId: fakeStudentduplicate.document?.documentTypeId,
          },
        },
        'school-123',
      ),
    ).rejects.toBeInstanceOf(StudentWithSameDocumentAlreadyExistsError);
  });
});
