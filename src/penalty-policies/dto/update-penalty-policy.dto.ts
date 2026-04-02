import z from 'zod';

export const updatePenaltyPolicySchema = z
  .object({
    name: z.string().min(1, 'Name is required').optional(),
    triggerFeeTypeId: z.uuid('Tipo de taxa de acionamento inválido').optional(),
    penaltyFeeTypeId: z.uuid('Tipo de taxa de penalidade inválido').optional(),
    academicYearId: z.uuid('Ano acadêmico inválido').optional(),
    gradeId: z.uuid('Turma inválida').nullable().optional(),
    mode: z
      .enum(['FIXED', 'PERCENTAGE', 'INTERVAL_FIXED', 'INTERVAL_PERCENTAGE'])
      .optional(),
    value: z.coerce
      .number()
      .positive('Valor deve ser um número positivo')
      .optional(),
    graceDay: z.coerce
      .number()
      .int()
      .positive('Dias de carência deve ser um número inteiro positivo')
      .optional(),
    intervalDays: z.coerce
      .number()
      .int()
      .positive('Intervalo de dias deve ser um número inteiro positivo')
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
