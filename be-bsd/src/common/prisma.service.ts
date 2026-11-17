import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaPg({ connectionString: process.env['DATABASE_URL'] });
    super({ adapter, log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'] });
  }

  async onModuleInit() {
    // Prisma with adapter connects lazily; no explicit $connect needed
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env['NODE_ENV'] === 'production') return;
    const models = Reflect.ownKeys(this).filter(
      (k) => typeof k === 'string' && !k.startsWith('_') && !k.startsWith('$'),
    ) as Array<keyof this>;
    for (const model of models) {
      const delegate = this[model] as { deleteMany?: () => Promise<unknown> } | undefined;
      if (delegate?.deleteMany) {
        await delegate.deleteMany();
      }
    }
  }
}