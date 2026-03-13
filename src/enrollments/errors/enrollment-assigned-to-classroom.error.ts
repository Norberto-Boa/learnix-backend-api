import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentAssignedToThisClassroomError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('Este estudante ja esta inserco nessa turma!');
  }
}
