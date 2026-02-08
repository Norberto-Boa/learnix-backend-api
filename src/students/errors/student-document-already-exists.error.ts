import type { DomainException } from '@/shared/@types/DomainException';

export class StudentWithSameDocumentAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Ja existe um estudante com este documento registado!`);
  }
}
