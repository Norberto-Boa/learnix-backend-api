import type { FEE_TYPE_CATEGORY } from "@/generated/prisma/enums";
import type { DbContext } from "@/prisma/shared/db-context";
import type { FeeTypeDomain } from "../domain/fee-type";

export interface FindManyFeeTypesParams {
  search?: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

export interface CreateFeeTypeRepositoryData {
  name: string;
  code: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean;
}

export interface UpdateFeeTypeRepositoryData {
  name?: string;
  code?: string;
  category?: FEE_TYPE_CATEGORY;
  isRecurring?: boolean
}

export abstract class FeeTypesRepository {
  abstract save(data: CreateFeeTypeRepositoryData, schoolId: string, db?: DbContext): Promise<FeeTypeDomain>
  abstract findById(id: string, schoolId: string): Promise<FeeTypeDomain>
  abstract findByCode(code: string, schoolId: string): Promise<FeeTypeDomain>
  abstract findMany(schoolId: string, params: FindManyFeeTypesParams): Promise<FeeTypeDomain[]>
  abstract update(id: string, schoolId: string, data: UpdateFeeTypeRepositoryData): Promise<FeeTypeDomain>
  abstract delete(id: string, schoolId: string): Promise<void>
}
