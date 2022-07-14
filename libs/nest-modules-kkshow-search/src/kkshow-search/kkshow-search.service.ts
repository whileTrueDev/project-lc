import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  ProductSearch,
  BroadcasterSearch,
  SearchResult,
  SearchKeyword,
} from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';

@Injectable()
export class KkshowSearchService {
  constructor(private readonly prisma: PrismaService) {}

  private async search(keyword: string): Promise<{
    productSearch: ProductSearch[];
    broadcasterSearch: BroadcasterSearch[];
  }> {
    const productSearch = await this.prisma.goods.findMany({
      where: {
        goods_name: {
          search: keyword.trim(),
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
        image: {
          select: {
            image: true,
          },
        },
        LiveShopping: {
          select: {
            broadcaster: {
              select: {
                userNickname: true,
                avatar: true,
                channels: {
                  select: {
                    url: true,
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
    const broadcasterSearch = await this.prisma.liveShopping.findMany({
      where: {
        broadcaster: {
          userNickname: {
            search: keyword.trim(),
          },
        },
      },
      select: {
        broadcaster: {
          select: {
            userNickname: true,
            avatar: true,
            channels: {
              select: {
                url: true,
              },
            },
          },
        },
        goods: {
          select: {
            id: true,
            goods_name: true,
            confirmation: {
              select: {
                firstmallGoodsConnectionId: true,
              },
            },
            image: {
              select: {
                image: true,
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
    });
    return { productSearch, broadcasterSearch };
  }

  async searchResultPreprocessing(keyword: SearchKeyword): Promise<SearchResult> {
    const data = await this.search(keyword.keyword);

    const goods = [];
    const broadcasters = [];
    const liveContents = [];

    await data.productSearch.forEach((row) => {
      const getCorrectLinkUrl = (): string => {
        if (row.confirmation?.firstmallGoodsConnectionId) {
          return `https://k-kmarket.com/goods/view?no=${row.confirmation.firstmallGoodsConnectionId}`;
        }
        return `${getKkshowWebHost()}/goods/${row.id}`;
      };
      if (row.LiveShopping.length !== 0) {
        goods.push({
          title: row.goods_name,
          linkUrl: getCorrectLinkUrl(),
          imageUrl: row.image[0]?.image,
        });
        broadcasters.push({
          title: row.LiveShopping[0].broadcaster.userNickname,
          linkUrl: row.LiveShopping[0].broadcaster.channels[0]?.url,
          imageUrl: row.LiveShopping[0].broadcaster.avatar,
        });

        if (row.LiveShopping[0].liveShoppingVideo) {
          liveContents.push({
            title: row.goods_name,
            linkUrl: row.LiveShopping[0].liveShoppingVideo.youtubeUrl,
            imageUrl: row.LiveShopping[0].broadcaster.avatar,
          });
        }
      } else {
        goods.push({
          title: row.goods_name,
          linkUrl: getCorrectLinkUrl(),
          imageUrl: row.image[0].image,
        });
      }
    });

    await data.broadcasterSearch.forEach((row) => {
      goods.push({
        title: row.goods.goods_name,
        linkUrl: row.goods?.confirmation?.firstmallGoodsConnectionId
          ? `https://k-kmarket.com/goods/view?no=${row.goods.confirmation.firstmallGoodsConnectionId}`
          : `${getKkshowWebHost()}/goods/${row.goods.id}`,
        imageUrl: row.goods.image[0].image,
      });

      broadcasters.push({
        title: row.broadcaster.userNickname,
        linkUrl: row.broadcaster.channels[0]?.url, // 향후 상품홍보페이지로 이동하도록 변경
        imageUrl: row.broadcaster.avatar,
      });

      if (row.liveShoppingVideo) {
        liveContents.push({
          title: row.goods.goods_name,
          linkUrl: row.liveShoppingVideo.youtubeUrl,
          imageUrl: row.broadcaster.avatar,
        });
      }
    });

    const uniqueGoods = goods.filter((row, idx, arr) => {
      return (
        arr.findIndex(
          (item) => item.title === row.title && item.linkUrl === row.linkUrl,
        ) === idx
      );
    });
    const uniqueBroadcasters = broadcasters.filter((row, idx, arr) => {
      return (
        arr.findIndex(
          (item) => item.title === row.title && item.linkUrl === row.linkUrl,
        ) === idx
      );
    });
    const uniqueLiveContents = liveContents.filter((row, idx, arr) => {
      return (
        arr.findIndex(
          (item) => item.title === row.title && item.linkUrl === row.linkUrl,
        ) === idx
      );
    });

    return {
      goods: uniqueGoods,
      broadcasters: uniqueBroadcasters,
      liveContents: uniqueLiveContents,
    };
  }
}
