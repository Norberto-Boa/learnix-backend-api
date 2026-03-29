import type { DomainException } from '@/shared/@types/DomainException';

export class FeeStructureAlreadyExistsError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super('A estrutura de taxa já existe para os critérios especificados!');
  }
}
