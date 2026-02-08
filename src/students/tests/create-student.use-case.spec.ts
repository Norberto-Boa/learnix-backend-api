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
});
