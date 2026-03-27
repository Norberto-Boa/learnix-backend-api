import { createZodDto } from "nestjs-zod";
import z from "zod";

export const queryFeeTypeByIdSchema = z.object({
  id: z.uuid()
});

export class QueryFeeTypeByIdDTO extends createZodDto(queryFeeTypeByIdSchema) { }