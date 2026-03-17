import type { FEE_TYPE_CATEGORY } from "@/generated/prisma/enums";

export interface FeeTypeDomain {
  id: string;
  name: string;
  code: string;
  category: FEE_TYPE_CATEGORY,
  isRecurring: boolean,
  schoolId: string,
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date | null
}