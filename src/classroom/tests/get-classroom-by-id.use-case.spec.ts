import { classroomFactory } from '@test/factories/classroom.factory';
import { InMemoryClassroomRepository } from '../repositories/in-memory/in-memory-classroom.repository';
import { GetClassroomByIdUseCase } from '../use-cases/get-classroom-by-id.use-case';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';

let classroomRepository: InMemoryClassroomRepository;
let sut: GetClassroomByIdUseCase;

describe('Get Classroom By Id Use Case', async () => {
  beforeEach(() => {
    classroomRepository = new InMemoryClassroomRepository();
    sut = new GetClassroomByIdUseCase(classroomRepository);
  });

  it('Should be able to get a classroom by id', async () => {
    const classroom = await classroomRepository.save(classroomFactory());

    const result = await sut.execute(classroom.id, classroom.schoolId);

    expect(result.id).toBe(classroom.id);
  });

  it('Should not be able to get a classroom from another school', async () => {
    const classroom = await classroomRepository.save(classroomFactory());

    await expect(() =>
      sut.execute(classroom.id, 'school-2'),
    ).rejects.toBeInstanceOf(ClassroomNotFoundError);
  });
});
