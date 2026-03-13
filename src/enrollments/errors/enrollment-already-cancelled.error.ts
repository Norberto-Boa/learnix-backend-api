import type { DomainException } from '@/shared/@types/DomainException';

export class enrollmentAlreadyCancelledError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('Esta matricula ja foi cancelada!');
  }
}
