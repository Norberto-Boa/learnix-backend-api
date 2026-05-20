import type { DomainException } from '@/shared/@types/DomainException';

export class EnrollmentAcademicYearDoesNotMatchAcademicYearError
  extends Error
  implements DomainException
{
  statusCode = 409;

  constructor() {
    super(
      `A cobranca para esta matricula tem um ano diferente do ano da matricula do aluno!`,
    );
  }
}
