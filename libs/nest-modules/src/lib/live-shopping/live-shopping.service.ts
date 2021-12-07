import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { throwError } from 'rxjs';
import {
  LiveShoppingParamsDto,
  LiveShoppingWithConfirmation,
  LiveShoppingRegistDTO,
} from '@project-lc/shared-types';
import { UserPayload } from '../auth/auth.interface';

@Injectable()
export class LiveShoppingService {
  constructor(private readonly prisma: PrismaService) {}

  async createLiveShopping(
    email: UserPayload['sub'],
    dto: LiveShoppingRegistDTO,
  ): Promise<{ liveShoppingId: number }> {
    const streamId = Math.random().toString(36).substr(2, 11);

    const userId = await this.prisma.seller.findFirst({
      where: { email },
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
    email: UserPayload['sub'],
    dto: LiveShoppingParamsDto,
  ): Promise<LiveShoppingWithConfirmation[]> {
    // 자신의 id를 반환하는 쿼리 수행하기
    const { id, goodsIds } = dto;
    return this.prisma.liveShopping.findMany({
      where: {
        id: id ? Number(id) : undefined,
        goodsId:
          goodsIds?.length >= 1
            ? { in: goodsIds.map((goodsid) => Number(goodsid)) }
            : undefined,
        seller: {
          email,
        },
      },
      include: {
        goods: {
          select: {
            goods_name: true,
            summary: true,
            confirmation: {
              select: {
                firstmallGoodsConnectionId: true,
              },
            },
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
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
      },
    });
  }

  async getBroadcasterRegisteredLiveShoppings(
    broadcasterId: number,
  ): Promise<LiveShoppingWithConfirmation[]> {
    // 자신의 id를 반환하는 쿼리 수행하기
    return this.prisma.liveShopping.findMany({
      where: {
        broadcasterId,
      },
      include: {
        goods: {
          select: {
            goods_name: true,
            summary: true,
            confirmation: {
              select: {
                firstmallGoodsConnectionId: true,
              },
            },
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
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
      },
    });
  }
}
