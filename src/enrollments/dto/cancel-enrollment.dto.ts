import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';

export const cancelEnrollmentSchema = z.object({});

export class CancelEnrollmentDTO extends createZodDto(cancelEnrollmentSchema) {}
