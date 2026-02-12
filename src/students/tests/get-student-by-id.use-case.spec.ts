import { studentFactory } from '@test/e2e/factories/student.factory';
import { InMemoryStudentsRepository } from '../repositories/in-memory/in-memory-students.repository';
import type { CreateStudentRequest } from '../use-cases/create-student.use-case';
import { GetStudentByIdUseCase } from '../use-cases/get-student-by-id.use-case';
import { StudentNotFoundError } from '../errors/student-not-found.error';

describe('GetStudentByIdUseCase', () => {
  let studentsRepository: InMemoryStudentsRepository;
  let useCase: GetStudentByIdUseCase;
  let fakeStudent: CreateStudentRequest;

  beforeEach(() => {
    studentsRepository = new InMemoryStudentsRepository();
    useCase = new GetStudentByIdUseCase(studentsRepository);
    fakeStudent = studentFactory({
      registrationNumber: 'REG-001',
      schoolId: 'school-123',
    });
  });

  it('Should return a student when found', async () => {
    const student = await studentsRepository.save({
      name: fakeStudent.name,
      registrationNumber: 'REG-001',
      dateOfBirth: new Date(fakeStudent.dateOfBirth),
      gender: fakeStudent.gender,
      schoolId: 'school-1',
    });

    const result = await useCase.execute({ studentId: student.id }, 'school-1');

    expect(result).toBeDefined();
    expect(result.id).toBe(student.id);
  });

  it('Should throw when student does not exist', async () => {
    await expect(() =>
      useCase.execute(
        {
          studentId: 'invailid-id',
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(StudentNotFoundError);
  });

  it('Should not return student from a another school', async () => {
    const student = await studentsRepository.save({
      name: fakeStudent.name,
      registrationNumber: 'REG-001',
      dateOfBirth: new Date(fakeStudent.dateOfBirth),
      gender: fakeStudent.gender,
      schoolId: 'school-1',
    });

    await expect(() =>
      useCase.execute(
        {
          studentId: student.id,
        },
        'school-2',
      ),
    ).rejects.toBeInstanceOf(StudentNotFoundError);
  });
});
