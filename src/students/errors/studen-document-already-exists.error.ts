import type { DomainException } from '@/shared/@types/DomainException';

export class StudentAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Ja existe um estudante com este documento registado!`);
  }
}
