import type { DomainException } from '@/shared/@types/DomainException';

export class StudentAlreadyActiveError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Estudante ja esta activo!`);
  }
}
