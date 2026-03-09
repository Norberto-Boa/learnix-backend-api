import type { DomainException } from '@/shared/@types/DomainException';

export class GradeAlreadyUsesThisNameError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`Já existe uma classe com este nome criado!`);
  }
}
