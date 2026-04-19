import type { DomainException } from '@/shared/@types/DomainException';

export class IntervalDaysMustOnlyBeProvidedForIntervalMode
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super(
      'O valor de intervalo de dias so pode existir em multas de intervalos!',
    );
  }
}
