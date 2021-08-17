import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getData(): Promise<{ message: string }> {
    return { message: 'test' };
  }
}
