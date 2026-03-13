import type { DomainException } from '@/shared/@types/DomainException';

export class enrollmentAlreadyCompletedError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super('Matricula completada nao pode ser cancelada!');
  }
}
