import type { DomainException } from '@/shared/@types/DomainException';

export class IntervalDaysMustBeGreaterThanZero
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('O valor de intervalo de days deve ser maior que 0!');
  }
}
