import type { DomainException } from '@/shared/@types/DomainException';

export class StudentAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Estudante com este numero de registro ja foi existe!`);
  }
}
