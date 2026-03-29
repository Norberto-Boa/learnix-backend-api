import type { DomainException } from '@/shared/@types/DomainException';

export class ScopeSchoolCannotHaveGradeError
  extends Error
  implements DomainException
{
  statusCode = 400;

  constructor() {
    super(
      'Uma estrutura de taxa com escopo escolar não pode ter uma turma associada!',
    );
  }
}
