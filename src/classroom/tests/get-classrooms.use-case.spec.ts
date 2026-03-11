import { classroomFactory } from '@test/factories/classroom.factory';
import { InMemoryClassroomRepository } from '../repositories/in-memory/in-memory-classroom.repository';
import { GetClassroomUseCase } from '../use-cases/get-classrooms.use-case';

let classroomRepository: InMemoryClassroomRepository;
let sut: GetClassroomUseCase;

describe('Get Classroom Use Case', async () => {
  beforeEach(() => {
    classroomRepository = new InMemoryClassroomRepository();
    sut = new GetClassroomUseCase(classroomRepository);
  });

  it('Should be able to get classrooms from a school', async () => {
    await classroomRepository.save(classroomFactory({ schoolId: 'school-1' }));
    await classroomRepository.save(classroomFactory({ schoolId: 'school-1' }));
    await classroomRepository.save(classroomFactory());

    const classrooms = await sut.execute({}, 'school-1');

    expect(classrooms).toHaveLength(2);
  });
});
