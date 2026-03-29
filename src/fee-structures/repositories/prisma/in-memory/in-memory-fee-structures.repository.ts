import type { FeeStructureDomain } from '@/fee-structures/domain/fee-structure';
import type {
  CreateFeeStructureInput,
  FeeStructuresRepository,
  FindManyFeeStructuresParams,
  UpdateFeeStructureInput,
} from '../../fee-structures.repository';
import type { DbContext } from '@/prisma/shared/db-context';

export class InMemoryFeeStructuresRepository implements FeeStructuresRepository {
  public items: FeeStructureDomain[] = [];

  async save(
    data: CreateFeeStructureInput,
    schoolId: string,
  ): Promise<FeeStructureDomain> {
    const feeStructure: FeeStructureDomain = {
      id: crypto.randomUUID(),
      feeTypeId: data.feeTypeId,
      scope: data.scope,
      academicYearId: data.academicYearId,
      gradeId: data.gradeId ?? null,
      amount: data.amount,
      schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(feeStructure);

    return feeStructure;
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<FeeStructureDomain | null> {
    const feeStructure = this.items.find(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    return feeStructure ?? null;
  }

  async findMany(
    schoolId: string,
    params: FindManyFeeStructuresParams,
  ): Promise<FeeStructureDomain[]> {
    return this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (item.deletedAt !== null) return false;
        if (params.feeTypeId && item.feeTypeId !== params.feeTypeId)
          return false;
        if (
          params.academicYearId &&
          item.academicYearId !== params.academicYearId
        )
          return false;
        if (params.scope && item.scope !== params.scope) return false;
        if (params.gradeId && item.gradeId !== params.gradeId) return false;
        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByUniqueCombination(
    schoolId: string,
    feeTypeId: string,
    academicYearId: string,
    gradeId: string | null,
  ): Promise<FeeStructureDomain | null> {
    const feeStructure = this.items.find(
      (item) =>
        item.schoolId === schoolId &&
        item.feeTypeId === feeTypeId &&
        item.academicYearId === academicYearId &&
        item.gradeId === gradeId &&
        item.deletedAt === null,
    );

    return feeStructure ?? null;
  }
  async update(
    id: string,
    schoolId: string,
    data: UpdateFeeStructureInput,
  ): Promise<FeeStructureDomain> {
    const index = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    const current = this.items[index];

    const updated: FeeStructureDomain = {
      ...current,
      ...(data.feeTypeId !== undefined ? { feeTypeId: data.feeTypeId } : {}),
      ...(data.scope !== undefined ? { scope: data.scope } : {}),
      ...(data.academicYearId !== undefined
        ? { academicYearId: data.academicYearId }
        : {}),
      ...(data.gradeId !== undefined ? { gradeId: data.gradeId } : {}),
      ...(data.amount !== undefined ? { amount: data.amount } : {}),
      updatedAt: new Date(),
    };

    this.items[index] = updated;

    return updated;
  }

  async delete(id: string, schoolId: string): Promise<void> {
    const index = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    this.items[index] = {
      ...this.items[index],
      deletedAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
