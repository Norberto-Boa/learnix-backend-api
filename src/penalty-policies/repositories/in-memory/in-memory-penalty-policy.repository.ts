import type {
  PenaltyPolicyRepository,
  UpdatePenaltyPolicyInput,
} from '../penalty-policy.repository';
import { PenaltyPolicyDomain } from '../../domain/penalty-policy';
import type { CreatePenaltyPolicyDTO } from '@/penalty-policies/dto/create-penalty-policy.dto';
import type { DbContext } from '@/prisma/shared/db-context';
import type { UpdatePenaltyPolicyDTO } from '@/penalty-policies/dto/update-penalty-policy.dto';
import type { GetPenaltyPoliciesQueryDTO } from '@/penalty-policies/dto/get-penalty-policy.dto';
import { CreatePenaltyPolicyInput } from '../penalty-policy.repository';

export class InMemoryPenaltyPolicyRepository implements PenaltyPolicyRepository {
  items: PenaltyPolicyDomain[] = [];

  async save(
    data: CreatePenaltyPolicyInput,
    schoolId: string,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain> {
    const penaltyPolicy: PenaltyPolicyDomain = {
      id: crypto.randomUUID(),
      name: data.name,
      triggerFeeTypeId: data.triggerFeeTypeId,
      penaltyFeeTypeId: data.penaltyFeeTypeId,
      academicYearId: data.academicYearId,
      gradeId: data.gradeId ?? null,
      mode: data.mode,
      value: data.value,
      graceDay: data.graceDay,
      intervalDays: data.intervalDays ?? null,
      isActive: data.isActive ?? true,
      schoolId: schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(penaltyPolicy);

    return penaltyPolicy;
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdatePenaltyPolicyInput,
    db?: DbContext,
  ): Promise<PenaltyPolicyDomain> {
    const itemIndex = this.items.findIndex(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    const currentItem = this.items[itemIndex];

    const updateItem: PenaltyPolicyDomain = {
      ...currentItem,
      ...(data.name !== undefined && { name: data.name }),
      ...(data.triggerFeeTypeId !== undefined && {
        triggerFeeTypeId: data.triggerFeeTypeId,
      }),
      ...(data.penaltyFeeTypeId !== undefined && {
        penaltyFeeTypeId: data.penaltyFeeTypeId,
      }),
      ...(data.academicYearId !== undefined && {
        academicYearId: data.academicYearId,
      }),
      ...(data.gradeId !== undefined && {
        gradeId: data.gradeId,
      }),
      ...(data.mode !== undefined && { mode: data.mode }),
      ...(data.value !== undefined && { value: data.value }),
      ...(data.graceDay !== undefined && { graceDay: data.graceDay }),
      ...(data.intervalDays !== undefined && {
        intervalDays: data.intervalDays,
      }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      updatedAt: new Date(),
    };

    this.items[itemIndex] = updateItem;

    return updateItem;
  }

  async delete(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const penaltyPolicy = this.items.find(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    if (!penaltyPolicy) {
      return;
    }

    penaltyPolicy.deletedAt = new Date();
    penaltyPolicy.updatedAt = new Date();
  }

  async findById(
    id: string,
    schoolId: string,
  ): Promise<PenaltyPolicyDomain | null> {
    const penaltyPolicy = this.items.find(
      (item) =>
        item.id === id && item.schoolId === schoolId && item.deletedAt === null,
    );

    return penaltyPolicy ?? null;
  }

  async findDuplicate(
    schoolId: string,
    academicYearId: string,
    triggerFeeTypeId: string,
    gradeId?: string | null,
    excludeId?: string,
  ): Promise<PenaltyPolicyDomain | null> {
    const penaltyPolicy = this.items.find((item) => {
      if (item.schoolId !== schoolId) return false;
      if (item.deletedAt !== null) return false;
      if (item.academicYearId !== academicYearId) return false;
      if (item.triggerFeeTypeId !== triggerFeeTypeId) return false;
      if ((item.gradeId ?? null) !== (gradeId ?? null)) return false;
      if (excludeId && item.id === excludeId) return false;

      return true;
    });

    return penaltyPolicy ?? null;
  }

  async findMany(
    schoolId: string,
    params: GetPenaltyPoliciesQueryDTO,
  ): Promise<PenaltyPolicyDomain[]> {
    const penaltyPolicies = this.items
      .filter((item) => {
        if (item.schoolId !== schoolId) return false;
        if (item.deletedAt !== null) return false;

        if (
          params.search &&
          !item.name.toLowerCase().includes(params.search.toLowerCase())
        ) {
          return false;
        }

        if (
          params.academicYearId &&
          item.academicYearId !== params.academicYearId
        ) {
          return false;
        }

        if (params.gradeId && item.gradeId !== params.gradeId) {
          return false;
        }

        if (
          params.triggerFeeTypeId &&
          item.triggerFeeTypeId !== params.triggerFeeTypeId
        ) {
          return false;
        }

        if (
          params.penaltyFeeTypeId &&
          item.penaltyFeeTypeId !== params.penaltyFeeTypeId
        ) {
          return false;
        }

        if (
          params.isActive !== undefined &&
          item.isActive !== params.isActive
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;

    return penaltyPolicies.slice(start, end);
  }

  async countMany(
    schoolId: string,
    params: Omit<GetPenaltyPoliciesQueryDTO, 'page' | 'limit'>,
  ): Promise<number> {
    return this.items.filter((item) => {
      if (item.schoolId !== schoolId) return false;
      if (item.deletedAt !== null) return false;

      if (
        params.search &&
        !item.name.toLowerCase().includes(params.search.toLowerCase())
      ) {
        return false;
      }

      if (
        params.academicYearId &&
        item.academicYearId !== params.academicYearId
      ) {
        return false;
      }

      if (params.gradeId && item.gradeId !== params.gradeId) {
        return false;
      }

      if (
        params.triggerFeeTypeId &&
        item.triggerFeeTypeId !== params.triggerFeeTypeId
      ) {
        return false;
      }

      if (
        params.penaltyFeeTypeId &&
        item.penaltyFeeTypeId !== params.penaltyFeeTypeId
      ) {
        return false;
      }

      if (params.isActive !== undefined && item.isActive !== params.isActive) {
        return false;
      }

      return true;
    }).length;
  }
}
