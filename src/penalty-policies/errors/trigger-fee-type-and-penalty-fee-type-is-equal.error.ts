import type { DomainException } from '@/shared/@types/DomainException';

export class TriggerFeeTypeAndPenaltyFeeTypeIsEqualError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(`O motivo da multa nao pode ter mesmo tipo que a multa!`);
  }
}
