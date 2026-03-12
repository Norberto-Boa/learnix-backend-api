import type { DomainException } from '@/shared/@types/DomainException';

export class AcademicYearClosedError extends Error implements DomainException {
  statusCode = 400;

  constructor() {
    super('O ano lectivo esta fechado!');
  }
}
