import { Injectable } from '@nestjs/common';
import {
  GoodsConfirmationStatuses,
  GoodsStatus,
  GoodsView,
  LiveShopppingProgressType,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterSearch, ProductSearch, SearchResult } from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';

@Injectable()
export class KkshowSearchService {
  constructor(private readonly prisma: PrismaService) {}

  public async search(keyword: string): Promise<SearchResult> {
    const SEARCH_KEYWORD = keyword.trim();

    const goodsSelect = {
      id: true,
      goods_name: true,
      confirmation: { select: { firstmallGoodsConnectionId: true } },
      image: { select: { image: true } },
    };

    const broadcasterSelect = {
      userNickname: true,
      avatar: true,
      BroadcasterPromotionPage: true,
    };

    const productSearch = await this.prisma.goods.findMany({
      where: {
        goods_status: { notIn: [GoodsStatus.runout, GoodsStatus.unsold] },
        goods_view: GoodsView.look,
        confirmation: { status: GoodsConfirmationStatuses.confirmed },
        OR: [
          { goods_name: { search: SEARCH_KEYWORD } },
          { summary: { contains: SEARCH_KEYWORD } },
          { seller: { name: SEARCH_KEYWORD } },
          { seller: { sellerShop: { shopName: { contains: SEARCH_KEYWORD } } } },
          { searchKeyword: { contains: SEARCH_KEYWORD } },
        ],
      },
      select: {
        ...goodsSelect,
        LiveShopping: {
          select: {
            broadcaster: { select: broadcasterSelect },
            liveShoppingVideo: { select: { youtubeUrl: true } },
          },
        },
      },
    });
    const broadcasterSearch = await this.prisma.liveShopping.findMany({
      where: {
        progress: LiveShopppingProgressType.confirmed,
        broadcaster: {
          userNickname: { search: SEARCH_KEYWORD },
          agreementFlag: true,
          BroadcasterPromotionPage: { url: { not: null } },
        },
      },
      select: {
        broadcaster: { select: broadcasterSelect },
        goods: { select: goodsSelect },
        liveShoppingVideo: { select: { youtubeUrl: true } },
      },
    });
    return this.searchResultPreprocessing({ productSearch, broadcasterSearch });
  }

  /** 검색 결과 전처리 함수 */
  private async searchResultPreprocessing({
    productSearch,
    broadcasterSearch,
  }: {
    productSearch: ProductSearch[];
    broadcasterSearch: BroadcasterSearch[];
  }): Promise<SearchResult> {
    const goods = [];
    const broadcasters = [];
    const liveContents = [];

    // 중복 방지 처리를 위한 Set 구성
    const ID_SET = new Set<string>();
    productSearch.forEach((_goods) => {
      if (!ID_SET.has(`goods:${_goods.goods_name}`)) {
        goods.push({
          title: _goods.goods_name,
          linkUrl: this.getGoodsLinkUrl(_goods),
          imageUrl: _goods.image[0]?.image,
        });
        ID_SET.add(`goods:${_goods.goods_name}`);
      }
      if (_goods.LiveShopping.length > 0) {
        _goods.LiveShopping.forEach((liveShopping) => {
          if (
            liveShopping.broadcaster?.userNickname &&
            !ID_SET.has(`bc:${liveShopping.broadcaster.userNickname}`) &&
            liveShopping.broadcaster.BroadcasterPromotionPage?.url
          ) {
            broadcasters.push({
              title: liveShopping.broadcaster.userNickname,
              linkUrl: liveShopping.broadcaster.BroadcasterPromotionPage?.url,
              imageUrl: liveShopping.broadcaster.avatar,
            });
            ID_SET.add(`bc:${liveShopping.broadcaster.userNickname}`);
          }
          if (liveShopping.liveShoppingVideo && !ID_SET.has(`lsv:${_goods.goods_name}`)) {
            liveContents.push({
              title: _goods.goods_name,
              linkUrl: liveShopping.liveShoppingVideo.youtubeUrl,
              imageUrl: liveShopping.broadcaster.avatar,
            });
            ID_SET.add(`lsv:${_goods.goods_name}`);
          }
        });
      }
    });

    broadcasterSearch.forEach(({ broadcaster, goods: _goods, liveShoppingVideo }) => {
      if (!ID_SET.has(`goods:${_goods.goods_name}`)) {
        goods.push({
          title: _goods.goods_name,
          linkUrl: this.getGoodsLinkUrl(_goods),
          imageUrl: _goods.image[0]?.image,
        });
        ID_SET.add(`goods:${_goods.goods_name}`);
      }

      if (
        broadcaster?.userNickname &&
        !ID_SET.has(`bc:${broadcaster.userNickname}`) &&
        broadcaster.BroadcasterPromotionPage?.url
      ) {
        broadcasters.push({
          title: broadcaster?.userNickname,
          linkUrl: broadcaster.BroadcasterPromotionPage?.url,
          imageUrl: broadcaster.avatar,
        });
        ID_SET.add(`bc:${broadcaster.userNickname}`);
      }

      if (liveShoppingVideo && !ID_SET.has(`lsv:${_goods.goods_name}`)) {
        liveContents.push({
          title: _goods.goods_name,
          linkUrl: liveShoppingVideo.youtubeUrl,
          imageUrl: broadcaster.avatar,
        });
        ID_SET.add(`lsv:${_goods.goods_name}`);
      }
    });

    return { goods, broadcasters, liveContents };
  }

  /**
   * 올바른 상품상세 링크 URL을 반환합니다.
   * (Firstmall 사용하던 때의 상품 데이터의 경우 firstmall 링크를 반환) => firstmall서비스 해지하여 firstmall 링크 반환 코드 삭제
   * @param goods 검수 정보가 포함된 상품 정보
   * @returns 올바른 상품상세 링크 URL
   */
  private getGoodsLinkUrl = (goods: {
    id: number;
    confirmation?: { firstmallGoodsConnectionId?: number };
  }): string => {
    return `${getKkshowWebHost()}/goods/${goods.id}`;
  };
}
