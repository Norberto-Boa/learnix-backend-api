import type { DomainException } from '@/shared/@types/DomainException';

export class FeeStructureNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('A estrutura de taxa não foi encontrada!');
  }
}
