import type { DomainException } from '@/shared/@types/DomainException';

export class PenaltyFeeTypeNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('Tipo de custo associado a multa como penalizacao nao encontrado');
  }
}
