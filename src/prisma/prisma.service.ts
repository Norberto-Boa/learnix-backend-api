import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@generated-prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { softDeleteExtension } from './extensions/soft-delete.extension';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private poolReference: Pool;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({ adapter });

    this.poolReference = pool;
  }

  async onModuleInit() {
    await this.$connect();

    this.$extends(softDeleteExtension());
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.poolReference.end();
  }
}
