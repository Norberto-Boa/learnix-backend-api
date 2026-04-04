import { PENALTY_MODE } from '@/generated/prisma/enums';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const createPenaltyPolicySchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    triggerFeeTypeId: z.uuid('Tipo de taxa de acionamento inválido'),
    penaltyFeeTypeId: z.uuid('Tipo de taxa de penalidade inválido'),
    academicYearId: z.uuid('Ano acadêmico inválido'),
    gradeId: z.uuid('Turma inválida').nullable().optional(),
    mode: z.enum(PENALTY_MODE),
    graceDay: z.coerce.number().int(),
    value: z.coerce.number().positive('Valor deve ser um número positivo'),
    intervalDays: z.coerce
      .number()
      .int()
      .positive('Intervalo de dias deve ser um número inteiro positivo')
      .optional(),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    const isIntervalMode =
      data.mode === 'INTERVAL_FIXED' || data.mode === 'INTERVAL_PERCENTAGE';

    if (
      isIntervalMode &&
      (data.intervalDays === undefined || data.intervalDays === null)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['intervalDays'],
        message:
          'Intervalo de dias é obrigatório para modos de penalidade baseados em intervalo',
      });
    }

    if (
      !isIntervalMode &&
      data.intervalDays !== undefined &&
      data.intervalDays !== null
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['intervalDays'],
        message:
          'Intervalo de dias não é permitido para modos de penalidade que não são baseados em intervalo',
      });
    }
  });

export class CreatePenaltyPolicyDTO extends createZodDto(
  createPenaltyPolicySchema,
) {}
