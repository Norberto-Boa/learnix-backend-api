import { Injectable } from "@nestjs/common";
import type { CreateFeeTypeRepositoryData, FeeTypesRepository, FindManyFeeTypesParams, UpdateFeeTypeRepositoryData } from "../fee-types.repository";
import type { PrismaService } from "@/prisma/prisma.service";
import type { FeeTypeDomain } from "@/fee-types/domain/fee-type";
import type { DbContext } from "@/prisma/shared/db-context";

@Injectable()
export class PrismaFeeTypesRepository implements FeeTypesRepository {
  constructor(private readonly prisma: PrismaService) { }

  getClient(db?: DbContext) {
    return db ?? this.prisma
  }

  async save(data: CreateFeeTypeRepositoryData, schoolId: string, db?: DbContext): Promise<FeeTypeDomain> {
    const client = this.getClient(db);

    return client.feeType.create({
      data: {
        ...data,
        schoolId
      }
    })
  }

  async findById(id: string, schoolId: string): Promise<FeeTypeDomain | null> {
    const feeType = await this.prisma.feeType.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });

    return feeType;
  }

  async findByCode(code: string, schoolId: string): Promise<FeeTypeDomain | null> {
    const feeType = await this.prisma.feeType.findFirst({
      where: {
        code,
        schoolId,
        deletedAt: null,
      },
    });

    return feeType;
  }

  async findMany(schoolId: string, params: FindManyFeeTypesParams): Promise<FeeTypeDomain[]> {
    return this.prisma.feeType.findMany({
      where: {
        schoolId,
        deletedAt: null,
        category: params.category,
        isRecurring: params.isRecurring,
        OR: params.search
          ? [
            {
              name: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
          ]
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(
    id: string,
    schoolId: string,
    data: UpdateFeeTypeRepositoryData,
    db?: DbContext
  ): Promise<FeeTypeDomain> {
    const client = this.getClient(db);

    return client.feeType.update({
      where: {
        id,
        schoolId
      },
      data: {
        ...data,
      }
    })
  }

  async delete(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const client = this.getClient(db);

    await client.feeType.update({
      where: {
        id,
        schoolId
      },
      data: {
        deletedAt: new Date()
      }
    })
  }
}