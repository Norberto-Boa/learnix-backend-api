import type { DomainException } from '@/shared/@types/DomainException';

export class ClassroomCapacityAlreadyExceedError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super('A turma ja esta cheia!');
  }
}
