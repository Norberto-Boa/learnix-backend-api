import type { FEE_TYPE_CATEGORY } from "@/generated/prisma/enums";

export interface FeeTypeDomain {
  id: string;
  name: string;
  code: string;
  catefory: FEE_TYPE_CATEGORY,
  isRecurring: boolean,
  schoolId: string,
  createdAt: string,
  updatedAt: string,
  deletedAt: string
}