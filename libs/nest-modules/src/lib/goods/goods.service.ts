/* eslint-disable camelcase */
// import { DeleteObjectsCommand, ObjectIdentifier, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoodsView, Seller } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsListDto,
  GoodsListRes,
  GoodsOptionsWithSupplies,
  GoodsOptionWithStockInfo,
  RegistGoodsDto,
  TotalStockInfo,
} from '@project-lc/shared-types';
import {
  S3Service,
  getImgSrcListFromHtmlStringList,
  getS3KeyListFromImgSrcList,
} from '../s3/s3.service';

@Injectable()
export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * 판매자의 승인된 상품 ID 목록을 가져옵니다.
   * @param email seller.sub 로그인된 판매자 정보
   * @param ids? 특정 상품의 firstMallGoodsId만 조회하고 싶을 때
   */
  public async findMyGoodsIds(email: Seller['email'], ids?: number[]): Promise<number[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
        seller: { email },
        id: ids ? { in: ids } : undefined,
        AND: {
          confirmation: {
            status: 'confirmed',
          },
        },
      },
      select: {
        confirmation: {
          select: {
            firstmallGoodsConnectionId: true,
          },
        },
      },
    });

    return goodsIds.map(
      (confirmation) => confirmation.confirmation.firstmallGoodsConnectionId,
    );
  }

  /**
   * 모든 상품 목록 조회
   * email 이 주어지면 해당 판매자의 상품만 조회
   * dto : email, page, itemPerPage, sort, direction
   * return : maxPage, totalItemCount, currentPage, prevPage, nextPage, items
   */
  public async getGoodsList({
    email,
    page,
    itemPerPage,
    sort,
    direction,
    groupId,
  }: GoodsListDto & { email?: string }): Promise<GoodsListRes> {
    const items = await this.prisma.goods.findMany({
      skip: page * itemPerPage,
      take: itemPerPage,
      where: { seller: { email }, shippingGroupId: groupId },
      orderBy: [{ [sort]: direction }],
      include: {
        options: {
          include: {
            supply: true,
          },
        },
        confirmation: true,
        ShippingGroup: true,
      },
    });

    const list = items.map((item) => {
      const optionsWithStockInfo = this.addAvailableStockInfoToOptions(item.options);
      const itemStockInfo = this.intergrateOptionStocks(optionsWithStockInfo);

      const defaultOption = item.options.find((opt) => opt.default_option === 'y');
      return {
        id: item.id,
        sellerId: item.sellerId,
        goods_name: item.goods_name,
        runout_policy: item.runout_policy,
        shipping_policy: item.shipping_policy,
        regist_date: item.regist_date,
        update_date: item.update_date,
        goods_status: item.goods_status,
        goods_view: item.goods_view,
        default_price: defaultOption.price, // 판매가(할인가)
        default_consumer_price: defaultOption.consumer_price, // 소비자가(미할인가)
        ...itemStockInfo,
        confirmation: item.confirmation,
        shippingGroup: item.ShippingGroup
          ? {
              id: item.ShippingGroup.id,
              shipping_group_name: item.ShippingGroup.shipping_group_name,
            }
          : undefined,
      };
    });

    // 해당 판매자가 등록한 전체 아이템 개수
    const totalItemCount = await this.prisma.goods.count({
      where: { seller: { email } },
    });
    const maxPage = Math.ceil(totalItemCount / itemPerPage); // 마지막페이지
    const currentPage = page; // 현재페이지
    const nextPage = currentPage < maxPage ? currentPage + 1 : null; // 다음페이지
    const prevPage = currentPage > 1 ? currentPage - 1 : null; // 이전페이지

    return {
      items: list,
      totalItemCount,
      maxPage,
      currentPage,
      nextPage,
      prevPage,
    };
  }

  // 상품옵션목록에 각 옵션 별 가용재고 정보를 추가
  private addAvailableStockInfoToOptions(
    options: GoodsOptionsWithSupplies[],
  ): GoodsOptionWithStockInfo[] {
    return options.map((option) => {
      const {
        id,
        default_option,
        option_title,
        option1,
        consumer_price,
        price,
        option_view,
        supply,
      } = option;

      const { stock } = supply; // 옵션의 재고
      const { badstock } = supply; // 옵션의 불량재고
      const rstock = stock - badstock; // 옵션의 가용재고
      return {
        id,
        default_option,
        option_title,
        option1,
        consumer_price,
        price,
        option_view,
        stock,
        badstock,
        rstock, // 가용재고
      };
    });
  }

  // 옵션별 재고 통합
  private intergrateOptionStocks(
    optionsWithStockInfo: GoodsOptionWithStockInfo[],
  ): TotalStockInfo {
    return optionsWithStockInfo.reduce(
      (total, option) => {
        return {
          rstock: total.rstock + option.rstock,
          a_stock_count:
            option.rstock > 0 ? total.a_stock_count + 1 : total.a_stock_count,
          b_stock_count:
            option.rstock <= 0 ? total.b_stock_count + 1 : total.b_stock_count,
          a_rstock: option.rstock > 0 ? total.a_rstock + option.rstock : total.a_rstock,
          b_rstock: option.rstock <= 0 ? total.b_rstock + option.rstock : total.b_rstock,
          a_stock: option.rstock > 0 ? total.a_stock + option.stock : total.a_stock,
          b_stock: option.rstock <= 0 ? total.b_stock + option.stock : total.b_stock,
        };
      },
      {
        rstock: 0, // 해당 상품의 전체 가용 재고
        a_stock_count: 0, // 가용재고 1개 이상인 옵션 개수
        b_stock_count: 0, // 가용재고 0개 이하인 옵션 개수
        a_rstock: 0, // 가용재고 1개 이상인 옵션의 가용재고
        b_rstock: 0, // 가용재고 0개 이하인 옵션의 가용재고
        a_stock: 0, // 가용재고 1개 이상인 옵션의 재고
        b_stock: 0, // 가용재고 0개 이하인 옵션의 재고
      },
    );
  }

  // 옵션 재고 조회
  public async getStockInfo(goods_seq: number) {
    const optionStocks = await this.prisma.goodsOptions.findMany({
      where: { goods: { id: goods_seq } },
      include: { supply: true },
    });

    // 해당 상품의 옵션별 이름, 가격, 재고정보 추가
    return this.addAvailableStockInfoToOptions(optionStocks);
  }

  // 유저가 등록한 상품 삭제
  // dto: email, [itemId, itemId, ...]
  public async deleteLcGoods({
    email,
    ids,
  }: {
    email: string;
    ids: number[];
  }): Promise<boolean> {
    try {
      // 이미지 삭제
      const deleteImages = this.deleteGoodsImagesFromS3(ids);

      // 상세설명 이미지 삭제
      const deleteContentImages = this.deleteGoodsContentImagesFromS3(ids);

      // 상품삭제
      const deleteGoods = this.prisma.goods.deleteMany({
        where: {
          seller: { email },
          id: {
            in: ids,
          },
        },
      });

      const result = await Promise.all([deleteImages, deleteContentImages, deleteGoods]);
      console.log(result);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 상품의 contents에서 s3 url 값 찾아서 삭제 요청 리턴 */
  async deleteGoodsContentImagesFromS3(goodsIds: number[]) {
    // goods Id 의 contents 모두 모으기
    const goodsContents = await this.prisma.goods.findMany({
      where: {
        id: {
          in: goodsIds,
        },
      },
      select: {
        contents: true,
      },
    });

    const contentList = goodsContents.map(({ contents }) => contents);

    // 각 contents마다 img src 구하기
    const imgSrcList: string[] = getImgSrcListFromHtmlStringList(contentList);

    // img src에서 s3에 저장된 이미지만 찾기
    const s3ImageKeys = getS3KeyListFromImgSrcList(imgSrcList);

    return this.s3service.deleteMultipleObjects(s3ImageKeys.map((key) => ({ Key: key })));
  }

  /** 상품과 연결된 GoodsImages url값을 찾아서 s3 객체 삭제 요청 리턴 */
  private async deleteGoodsImagesFromS3(goodsIds: number[]) {
    // goods Id 와 연결된 GoodsImage 찾기
    const images = await this.prisma.goodsImages.findMany({
      where: {
        goodsId: {
          in: goodsIds,
        },
      },
      select: {
        image: true,
      },
    });

    const imageList = images.map(({ image }) => image);

    // 이미지 중 s3에 업로드된 이미지 찾기
    const s3ImageKeys = getS3KeyListFromImgSrcList(imageList);

    return this.s3service.deleteMultipleObjects(s3ImageKeys.map((key) => ({ Key: key })));
  }

  // 노출여부 변경
  public async changeGoodsView(id: number, view: GoodsView): Promise<boolean> {
    try {
      await this.prisma.goods.update({
        where: { id },
        data: {
          goods_view: view,
        },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 상품 개별 정보 조회 */
  public async getOneGoods(goodsId: number, email: string) {
    return this.prisma.goods.findFirst({
      where: {
        id: goodsId,
        seller: {
          email,
        },
      },
      include: {
        options: { include: { supply: true } },
        ShippingGroup: {
          include: {
            shippingSets: {
              include: {
                shippingOptions: {
                  include: { shippingCost: true },
                },
              },
            },
          },
        },
        confirmation: true,
        image: true,
        GoodsInfo: true,
      },
    });
  }

  // 상품 등록
  public async registGoods(email: string, dto: RegistGoodsDto) {
    try {
      const { options, image, shippingGroupId, goodsInfoId, ...goodsData } = dto;
      const optionsData = options.map((opt) => {
        const { supply, ...optData } = opt;
        return {
          ...optData,
          supply: {
            create: supply,
          },
        };
      });
      const goods = await this.prisma.goods.create({
        data: {
          seller: { connect: { email } },
          ...goodsData,
          options: {
            create: optionsData,
          },
          image: {
            create: image,
          },
          ShippingGroup: shippingGroupId
            ? { connect: { id: shippingGroupId } }
            : undefined,
          GoodsInfo: goodsInfoId ? { connect: { id: goodsInfoId } } : undefined,
          confirmation: { create: { status: 'waiting' } },
        },
      });
      return { goodsId: goods.id };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
