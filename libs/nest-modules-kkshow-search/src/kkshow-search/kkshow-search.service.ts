import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class KkshowSearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(keyword: string): Promise<any> {
    const productSearch = await this.prisma.goods.findMany({
      where: {
        goods_name: {
          search: keyword,
        },
      },
      select: {
        id: true,
        goods_name: true,
        confirmation: {
          select: {
            firstmallGoodsConnectionId: true,
          },
        },
        LiveShopping: {
          select: {
            broadcaster: {
              select: {
                userNickname: true,
              },
            },
            liveShoppingVideo: {
              select: {
                youtubeUrl: true,
              },
            },
          },
        },
      },
    });
    const broadcasterSearch = await this.prisma.broadcaster.findMany({
      where: {
        userNickname: {
          search: keyword,
        },
      },
      select: {
        LiveShopping: {
          select: {
            goods: {
              select: {
                id: true,
                goods_name: true,
                confirmation: {
                  select: {
                    firstmallGoodsConnectionId: true,
                  },
                },
              },
            },
            liveShoppingVideo: {
              select: {
                youtubeUrl: true,
              },
            },
          },
        },
      },
    });

    console.log(productSearch);
    console.log(broadcasterSearch);
    return true;
  }
}
