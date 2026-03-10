import type { DomainException } from '@/shared/@types/DomainException';

export class ClassroomAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super('Esta turma ja esta registada no sistema!');
  }
}
