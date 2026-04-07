import type { DomainException } from '@/shared/@types/DomainException';

export class PenaltyPolicyNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('Politica de multa nao encontrada!');
  }
}
