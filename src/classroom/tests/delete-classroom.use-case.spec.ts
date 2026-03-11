import { ClassroomNotFoundError } from '../errors/classroom-not-found.error';
import { InMemoryClassroomRepository } from '../repositories/in-memory/in-memory-classroom.repository';
import { DeleteClassroomUseCase } from '../use-cases/delete-classroom.use-case';

let classroomRepository: InMemoryClassroomRepository;
let sut: DeleteClassroomUseCase;

describe('Delete Classroom Use Case', () => {
  beforeEach(() => {
    classroomRepository = new InMemoryClassroomRepository();
    sut = new DeleteClassroomUseCase(classroomRepository);
  });

  it('should be able to soft delete a classroom', async () => {
    const schoolId = 'school-1';

    const classroom = await classroomRepository.save({
      name: 'A',
      capacity: 30,
      gradeId: 'grade-1',
      academicYearId: 'year-1',
      schoolId,
    });

    await sut.execute({ id: classroom.id }, schoolId);

    expect(classroomRepository.items[0].deletedAt).toEqual(expect.any(Date));
  });

  it('should not able to delete a non-existing classroom', async () => {
    const schoolId = 'school-1';

    await expect(() =>
      sut.execute(
        {
          id: 'non-existing-id',
        },
        schoolId,
      ),
    ).rejects.toBeInstanceOf(ClassroomNotFoundError);
  });

  it('should not find classroom after soft delete in active queries', async () => {
    const schoolId = 'school-1';

    const classroom = await classroomRepository.save({
      name: 'A',
      capacity: 30,
      gradeId: 'grade-1',
      academicYearId: 'year-1',
      schoolId,
    });

    await sut.execute({ id: classroom.id }, schoolId);

    const foundClassroom = await classroomRepository.findById(
      classroom.id,
      schoolId,
    );

    expect(foundClassroom).toBeNull();
  });
});
