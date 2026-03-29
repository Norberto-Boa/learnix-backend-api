import type { DomainException } from '@/shared/@types/DomainException';

export class GradeIdRequiredError extends Error implements DomainException {
  statusCode = 400;

  constructor() {
    super(
      'O ID da turma é obrigatório para estruturas de taxas com escopo de turma!',
    );
  }
}
