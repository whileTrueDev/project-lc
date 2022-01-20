import { Injectable } from '@nestjs/common';
import {
  LiveShoppingStateBoardMessage,
  LiveShoppingStateBoardAlert,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class LiveShoppingStateBoardService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneMessage(
    liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardMessage | null> {
    const data = await this.prisma.liveShoppingStateBoardMessage.findFirst({
      where: { liveShoppingId },
    });

    if (!data) return null;

    return data;
  }

  async findOneAlert(
    liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardAlert | null> {
    const data = await this.prisma.liveShoppingStateBoardAlert.findFirst({
      where: { liveShoppingId },
    });

    if (!data) return null;

    return data;
  }

  async deleteOneAlert(liveShoppingId: number): Promise<boolean> {
    const data = await this.prisma.liveShoppingStateBoardAlert.findFirst({
      where: { liveShoppingId },
    });

    if (data) {
      await this.prisma.liveShoppingStateBoardAlert.delete({
        where: { id: data.id },
      });
      return true;
    }

    return true;
  }
}
