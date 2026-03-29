import type { DomainException } from '@/shared/@types/DomainException';

export class AcademicYearNotFoundError
  extends Error
  implements DomainException
{
  statusCode = 404;

  constructor() {
    super('Esse registo de ano letivo nao foi encontrado!');
  }
}
