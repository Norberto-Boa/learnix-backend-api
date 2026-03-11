import { ClassroomAlreadyExistsError } from '../errors/classroom-already-exists.error';
import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';
import { InMemoryClassroomRepository } from '../repositories/in-memory/in-memory-classroom.repository';
import { UpdateClassroomUseCase } from '../use-cases/update-classroom.use-case';

let classroomRepository: InMemoryClassroomRepository;
let sut: UpdateClassroomUseCase;

describe('Update Classroom Use Case', () => {
  beforeEach(() => {
    classroomRepository = new InMemoryClassroomRepository();
    sut = new UpdateClassroomUseCase(classroomRepository);
  });

  it('Should be able to update a classroom', async () => {
    const schoolId = 'school-1';

    const classroom = await classroomRepository.save({
      name: 'A',
      capacity: 30,
      gradeId: '1a',
      academicYearId: 'year-1',
      schoolId,
    });

    const updatedClassroom = await sut.execute(
      {
        id: classroom.id,
        name: 'B',
        capacity: 40,
      },
      schoolId,
    );

    expect(updatedClassroom.name).toBe('B');
  });

  it('Should be able to update a classroom', async () => {
    const schoolId = 'school-1';

    const classroomA = await classroomRepository.save({
      name: 'A',
      capacity: 30,
      gradeId: '1a',
      academicYearId: 'year-1',
      schoolId,
    });

    const classroomB = await classroomRepository.save({
      name: 'B',
      capacity: 25,
      gradeId: '1a',
      academicYearId: 'year-1',
      schoolId,
    });

    await expect(() =>
      sut.execute(
        {
          id: classroomB.id,
          name: 'A',
        },
        schoolId,
      ),
    ).rejects.toBeInstanceOf(ClassroomAlreadyExistsError);
  });

  it('Should not be able to update a non-existing classroom', async () => {
    const schoolId = 'school-1';

    await expect(() =>
      sut.execute(
        {
          id: 'non-existing-id',
          name: 'B',
        },
        schoolId,
      ),
    ).rejects.toBeInstanceOf(ClassroomNotFoundError);
  });
});
