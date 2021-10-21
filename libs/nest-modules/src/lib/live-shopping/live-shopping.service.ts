import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { throwError } from 'rxjs';
import { LiveShopping } from '@prisma/client';

interface LiveShoppingWithConfirmation extends LiveShopping {
  goods: {
    confirmation: {
      firstmallGoodsConnectionId: number;
    };
  };
}
@Injectable()
export class LiveShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  async createLiveShopping(sellerId, dto): Promise<{ liveShoppingId: number }> {
    const streamId = Math.random().toString(36).substr(2, 11);

    const userId = await this.prisma.seller.findFirst({
      where: { email: sellerId },
      select: {
        id: true,
      },
    });
    const liveShopping = await this.prisma.liveShopping.create({
      data: {
        seller: { connect: { id: userId.id } },
        streamId,
        requests: dto.requests,
        goods: { connect: { id: dto.goods_id } },
        sellerContacts: { connect: { id: dto.contactId } },
      },
    });
    return { liveShoppingId: liveShopping.id };
  }

  async deleteLiveShopping(liveShoppingId: { liveShoppingId: number }): Promise<boolean> {
    const doDelete = await this.prisma.liveShopping.delete({
      where: {
        id: liveShoppingId.liveShoppingId,
      },
    });

    if (!doDelete) {
      throwError('라이브 쇼핑 삭제 실패');
    }
    return true;
  }

  async getRegisteredLiveShoppings(
    id?: string,
    needConfirmation?: boolean,
  ): Promise<LiveShopping[] | LiveShoppingWithConfirmation[]> {
    return this.prisma.liveShopping.findMany({
      where: { id: id ? Number(id) : undefined },
      include: {
        goods: {
          select: {
            goods_name: true,
            summary: true,
            confirmation: needConfirmation
              ? {
                  select: {
                    firstmallGoodsConnectionId: true,
                  },
                }
              : undefined,
          },
        },
        seller: {
          select: {
            sellerShop: true,
          },
        },
        broadcaster: {
          select: {
            userNickname: true,
            afreecaId: true,
            twitchId: true,
            youtubeId: true,
            channelUrl: true,
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
      },
    });
  }
}
