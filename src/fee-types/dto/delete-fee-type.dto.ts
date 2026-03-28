import { createZodDto } from "nestjs-zod";
import z from "zod";

export const deleteFeeTypeSchema = z.object({
  id: z.uuid()
});

export class DeleteFeeTypeDTO extends createZodDto(deleteFeeTypeSchema) { }