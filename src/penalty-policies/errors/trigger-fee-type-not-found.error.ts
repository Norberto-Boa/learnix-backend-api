import type { DomainException } from '@/shared/@types/DomainException';

export class TriggerFeeTypeNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('Tipo de custo associado a multa como causador nao encontrado');
  }
}
