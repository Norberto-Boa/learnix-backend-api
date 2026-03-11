import { gradeFactory } from '@test/factories/grades.factory';
import { ClassroomAlreadyExistsError } from '../errors/classroom-already-exists.error';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';
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
    await classroomRepository.save(gradeFactory({ schoolId: 'school-1' }));
    await classroomRepository.save(gradeFactory({ schoolId: 'school-1' }));
    await classroomRepository.save(gradeFactory());

    const classrooms = await sut.execute({}, 'school-1');

    expect(classrooms).toHaveLength(2);
  });
});
