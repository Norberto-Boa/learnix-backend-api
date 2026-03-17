import type { FeeTypeDomain } from "@/fee-types/domain/fee-type";
import type { CreateFeeTypeRepositoryData, FeeTypesRepository, FindManyFeeTypesParams, UpdateFeeTypeRepositoryData } from "../fee-types.repository";
import type { DbContext } from "@/prisma/shared/db-context";
import { randomUUID } from "crypto";

export class InMemoryFeeTypesRepository implements FeeTypesRepository {
  public items: FeeTypeDomain[] = []

  async save(data: CreateFeeTypeRepositoryData, schoolId: string, db?: DbContext): Promise<FeeTypeDomain> {
    const feeType: FeeTypeDomain = {
      id: randomUUID(),
      name: data.name,
      code: data.code,
      category: data.category ?? 'NORMAL',
      isRecurring: data.isRecurring ?? false,
      schoolId: schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    }

    this.items.push(feeType);

    return feeType;
  }

  async findById(id: string, schoolId: string): Promise<FeeTypeDomain | null> {
    const feeType = this.items.find(
      (item) => item.id === id && item.schoolId === schoolId && item.deletedAt === null
    )

    if (!feeType) {
      return null
    }

    return feeType
  }

  async findByCode(code: string, schoolId: string): Promise<FeeTypeDomain | null> {
    const feeType = this.items.find(
      (item) => item.code === code && item.schoolId === schoolId && item.deletedAt === null
    )

    if (!feeType) {
      return null
    }

    return feeType
  }

  async findMany(schoolId: string, params: FindManyFeeTypesParams): Promise<FeeTypeDomain[]> {
    return this.items.filter((item) => {
      if (item.schoolId !== schoolId) return false
      if (item.deletedAt !== null) return false
      if (params.category && item.category !== params.category) return false;
      if (typeof params.isRecurring === 'boolean' && item.isRecurring !== params.isRecurring) { return false }
      if (params.search) {
        const search = params.search.trim().toLowerCase()

        const matchesName = item.name.toLowerCase().includes(search);
        const matchesCode = item.code.toLowerCase().includes(search);

        if (!matchesName && !matchesCode) return false
      }

      return true
    })
  }

  async update(id: string, schoolId: string, data: UpdateFeeTypeRepositoryData): Promise<FeeTypeDomain> {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.id === id &&
        item.schoolId === schoolId &&
        item.deletedAt === null
    )

    const currentItem = this.items[itemIndex]

    const updatedFeeType: FeeTypeDomain = {
      ...currentItem,
      name: data.name ?? currentItem.name,
      code: data.code ?? currentItem.code,
      category: data.category ?? currentItem.category,
      isRecurring: data.isRecurring ?? currentItem.isRecurring,
      updatedAt: new Date()
    }

    this.items[itemIndex] = updatedFeeType;

    return updatedFeeType;
  }

  async delete(id: string, schoolId: string): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.id === id &&
        item.schoolId === schoolId &&
        item.deletedAt === null
    )

    if (itemIndex < 0) return;

    this.items[itemIndex] = {
      ...this.items[itemIndex],
      deletedAt: new Date(),
      updatedAt: new Date()
    }
  }
}