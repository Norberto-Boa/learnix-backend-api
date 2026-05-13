import { Injectable } from '@nestjs/common';
import type {
  CreateProductRepositoryData,
  FindManyProductsParams,
  ProductsRepository,
} from '../products.repository';
import { PrismaService } from '@/prisma/prisma.service';
import type { DbContext } from '@/prisma/shared/db-context';
import { Product } from '../../domain/product';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private prisma: PrismaService) {}

  getClient(db?: DbContext) {
    return db ?? this.prisma;
  }

  async save(
    data: CreateProductRepositoryData,
    schoolId: string,
    db?: DbContext,
  ): Promise<Product> {
    const client = this.getClient(db);

    const product = await client.product.create({
      data: {
        ...data,
        schoolId,
      },
    });

    return { ...product, price: Number(product.price) };
  }

  async findById(id: string, schoolId: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        schoolId,
        deletedAt: null,
      },
    });

    if (!product) return null;

    return { ...product, price: Number(product.price) };
  }

  async findByName(name: string, schoolId: string): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        name,
        schoolId,
        deletedAt: null,
      },
    });

    if (!product) return null;

    return { ...product, price: Number(product.price) };
  }

  async findMany(
    schoolId: string,
    { page, limit, search }: FindManyProductsParams,
  ): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        schoolId,
        deletedAt: null,
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return products.map((product) => {
      return { ...product, price: Number(product.price) };
    });
  }

  async countMany(
    schoolId: string,
    params: { search?: string },
  ): Promise<number> {
    const { search } = params;

    return this.prisma.product.count({
      where: {
        schoolId,
        deletedAt: null,
        ...(search && {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
  }

  async delete(id: string, schoolId: string, db?: DbContext): Promise<void> {
    const client = db ?? this.prisma;

    await client.product.update({
      where: {
        id,
        schoolId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
