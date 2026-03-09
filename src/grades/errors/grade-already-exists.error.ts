import type { DomainException } from '@/shared/@types/DomainException';

export class GradeAlreadyExistsError extends Error implements DomainException {
  statusCode = 409;

  constructor() {
    super(`Está classe já foi criada!`);
  }
}
