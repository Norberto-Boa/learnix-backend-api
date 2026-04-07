import type { DomainException } from '@/shared/@types/DomainException';

export class PenaltyFeeTypeMustBePenaltyError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('O causador da multa deve ser um gasto do tipo de penalidade!');
  }
}
