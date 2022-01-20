import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LiveShoppingStateBoardMessage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class LiveShoppingStateBoardMessageService {
  constructor(private readonly prisma: PrismaService) {}

  private async findOne(
    liveShoppingId: number,
  ): Promise<LiveShoppingStateBoardMessage | null> {
    const data = await this.prisma.liveShoppingStateBoardMessage.findFirst({
      where: { liveShoppingId },
    });

    if (!data) return null;

    return data;
  }

  async createMessage({
    liveShoppingId,
    text,
  }: {
    liveShoppingId: number;
    text: string;
  }): Promise<any> {
    try {
      const data = await this.findOne(liveShoppingId);

      if (!data) {
        await this.prisma.liveShoppingStateBoardMessage.create({
          data: {
            liveShoppingId,
            text,
          },
        });

        return true;
      }

      await this.prisma.liveShoppingStateBoardMessage.update({
        where: {
          id: data.id,
        },
        data: {
          text,
        },
      });
      return true;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async deleteMessage(liveShoppingId: number): Promise<any> {
    const data = await this.findOne(liveShoppingId);

    if (!data) {
      throw new BadRequestException(`no message for liveShoppingId ${liveShoppingId}`);
    }

    await this.prisma.liveShoppingStateBoardMessage.delete({
      where: { id: data.id },
    });
    return true;
  }
}
