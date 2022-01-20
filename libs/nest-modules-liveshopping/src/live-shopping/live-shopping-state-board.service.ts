import { Injectable } from '@nestjs/common';
import { LiveShoppingStateBoardMessage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class LiveShoppingStateBoardService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(liveShoppingId: number): Promise<LiveShoppingStateBoardMessage | null> {
    const data = await this.prisma.liveShoppingStateBoardMessage.findFirst({
      where: { liveShoppingId },
    });

    if (!data) return null;

    return data;
  }
}
