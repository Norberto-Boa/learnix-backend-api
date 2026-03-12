import type { DomainException } from '@/shared/@types/DomainException';

export class StudentAlreadyEnrolledOnThisYearError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super('O estudante ja esta registado em uma turma este ano!');
  }
}
