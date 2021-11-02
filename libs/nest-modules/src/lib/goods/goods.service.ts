/* eslint-disable camelcase */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoodsImages, GoodsView, Seller } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  GoodsByIdRes,
  GoodsImageDto,
  GoodsListDto,
  GoodsListRes,
  GoodsOptionDto,
  GoodsOptionsWithSupplies,
  GoodsOptionWithStockInfo,
  RegistGoodsDto,
  TotalStockInfo,
  ApprovedGoodsNameAndId,
  getLiveShoppingProgress,
} from '@project-lc/shared-types';
import {
  getImgSrcListFromHtmlStringList,
  getS3KeyListFromImgSrcList,
  S3Service,
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
   * 관리자가 승인된 상품 ID(firsmall db의 goods_seq) 목록을 가져옵니다.
   * @param ids? 특정 상품의 firstMallGoodsId만 조회하고 싶을 때
   */
  public async findAdminGoodsIds(ids?: number[]): Promise<number[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
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
        LiveShopping: true,
      },
    });

    const list = items.map((item) => {
      const optionsWithStockInfo = this.addAvailableStockInfoToOptions(item.options);
      const itemStockInfo = this.intergrateOptionStocks(optionsWithStockInfo);

      const defaultOption = item.options.find((opt) => opt.default_option === 'y');

      let onLiveShopping = true;
      if (item.LiveShopping.length === 0) onLiveShopping = false;

      // 상품에 연결된 라이브쇼핑 데이터가 있는 경우
      if (item.LiveShopping.length > 0) {
        // 모든 데이터가 '판매종료', '취소됨' 상태가 아니라면 라이브쇼핑 진행중으로 봄
        onLiveShopping = !item.LiveShopping.every((live) => {
          const liveShoppingProgress = getLiveShoppingProgress(live);
          return ['판매종료', '취소됨'].includes(liveShoppingProgress);
        });
      }

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
        onLiveShopping,
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
  public async getStockInfo(goods_seq: number): Promise<GoodsOptionWithStockInfo[]> {
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
      await this.deleteGoodsImagesFromS3(ids);

      // 상세설명 이미지 삭제
      await this.deleteGoodsContentImagesFromS3(ids);

      // 상품삭제
      await this.prisma.goods.deleteMany({
        where: {
          seller: { email },
          id: {
            in: ids,
          },
        },
      });

      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 상품의 contents에서 s3 url 값 찾아서 삭제 요청 리턴 */
  async deleteGoodsContentImagesFromS3(goodsIds: number[]): Promise<void> {
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

    if (s3ImageKeys.length > 0) {
      await this.s3service.deleteMultipleObjects(
        s3ImageKeys.map((key) => ({ Key: key })),
      );
    }
  }

  /** 상품과 연결된 GoodsImages url값을 찾아서 s3 객체 삭제 요청 리턴 */
  async deleteGoodsImagesFromS3(goodsIds: number[]): Promise<void> {
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

    if (s3ImageKeys.length > 0) {
      await this.s3service.deleteMultipleObjects(
        s3ImageKeys.map((key) => ({ Key: key })),
      );
    }
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
  public async getOneGoods(goodsId: number, email: string): Promise<GoodsByIdRes> {
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
        LiveShopping: true,
      },
    });
  }

  // 상품 등록
  public async registGoods(
    email: string,
    dto: RegistGoodsDto,
  ): Promise<{
    goodsId: number;
  }> {
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
            connect: image.map((img) => ({ id: img.id })),
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

  /** 여러 상품이미지 등록 - 생성된 goodsImage[] 리턴 */
  async registGoodsImages(dto: GoodsImageDto[]): Promise<GoodsImages[]> {
    try {
      await this.prisma.goodsImages.createMany({
        data: dto,
      });
    } catch (e) {
      console.error(e);
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2000') {
          // GoodsImages.image 컬럼 타입보다 들어온 값이 큰 경우
          throw new BadRequestException(
            '파일 명이 너무 깁니다. 파일 명을 줄여서 다시 시도해주세요.',
          );
        }
      }
      throw new InternalServerErrorException('error in registGoodsImages');
    }

    return this.prisma.goodsImages.findMany({
      where: { image: { in: dto.map((item) => item.image) } },
    });
  }

  /** 하나의 상품이미지 삭제 */
  async deleteGoodsImage(imageId: number): Promise<boolean> {
    const imageToDeleted = await this.prisma.goodsImages.findUnique({
      where: { id: imageId },
    });

    if (!imageToDeleted)
      throw new BadRequestException(
        `상품 이미지 데이터가 존재하지 않습니다 id : ${imageId}`,
      );

    try {
      const url = imageToDeleted.image;
      const S3_DOMIAN = 'https://lc-project.s3.ap-northeast-2.amazonaws.com/';
      if (url.includes(S3_DOMIAN)) {
        const Key = url.replace(S3_DOMIAN, '');
        await this.s3service.deleteMultipleObjects([{ Key }]);
      }

      await this.prisma.goodsImages.delete({
        where: { id: imageId },
      });
      return true;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(e);
    }
  }

  /** 상품 수정시 상품 옵션 데이터 구분하는 함수(삭제, 수정, 생성) 
   * 
   *  option id 가 존재하면 업데이트
     option id가 undefined이면 create
     기존 상품에 있었으나 새로 들어온 정보에 없다면 삭제
  */
  private async distinguishOptions(
    goodsId: number,
    updateDtoOptions: GoodsOptionDto[],
  ): Promise<{
    willBeCreatedOptions: GoodsOptionDto[];
    willBeUpdatedOptions: GoodsOptionDto[];
    willBeDeletedOptIds: number[];
  }> {
    const originGoodsOptions = await this.prisma.goodsOptions.findMany({
      where: { goodsId },
      select: { id: true },
    });

    // 기존상품 옵션 id 목록
    const originGoodsOptionsId = originGoodsOptions.map((g) => g.id);

    // dto 옵션중 디비에 없는 옵션(create할거)
    const willBeCreatedOptions = updateDtoOptions.filter((o) => !o.id);

    // dto 옵션 중 디비에 존재하는 옵션(update 할거)
    const willBeUpdatedOptions = updateDtoOptions.filter((o) => !!o.id);
    // 디비에 존재하는 옵션 id 목록
    const comingOptionsId = willBeUpdatedOptions.map((g) => g.id);

    // 삭제할 옵션 id
    const willBeDeletedOptIds = originGoodsOptionsId.filter(
      (optId) => !comingOptionsId.includes(optId),
    );

    return {
      willBeCreatedOptions,
      willBeUpdatedOptions,
      willBeDeletedOptIds,
    };
  }

  /** 상품 수정 */
  async updateOneGoods(id: number, dto: RegistGoodsDto): Promise<{ goodsId: number }> {
    const {
      options: comingOptions,
      image,
      shippingGroupId,
      goodsInfoId,
      ...goodsData
    } = dto;

    const { willBeCreatedOptions, willBeUpdatedOptions, willBeDeletedOptIds } =
      await this.distinguishOptions(id, comingOptions);

    const { status: prevStatus } = await this.prisma.goodsConfirmation.findFirst({
      where: { goodsId: id },
      select: { status: true },
    });

    try {
      await this.prisma.goods.update({
        where: { id },
        data: {
          ...goodsData,
          options: {
            deleteMany: willBeDeletedOptIds.map((_id) => ({ id: _id })),
            create: willBeCreatedOptions.map((opt) => {
              const { supply, ...rest } = opt;
              return {
                ...rest,
                supply: { create: supply },
              };
            }),
            update: willBeUpdatedOptions.map((opt) => {
              const { id: optionId, supply, ...rest } = opt;
              return {
                where: { id: optionId },
                data: { ...rest, supply: { update: supply } },
              };
            }),
          },
          image: {
            connect: image.map((img) => ({ id: img.id })),
          },
          ShippingGroup: shippingGroupId
            ? { connect: { id: shippingGroupId } }
            : undefined,
          GoodsInfo: goodsInfoId ? { connect: { id: goodsInfoId } } : undefined,
          confirmation: {
            update: {
              status: prevStatus === 'waiting' ? 'waiting' : 'needReconfirmation',
            },
          }, // 상품 수정 후  (승인, 거절, 재검수 대기) 상태에서는 '재검수 대기' 상태로 변경, (대기) 상태에서는 그대로 '대기' 상태
        },
      });
      return { goodsId: id };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(`error in update goods, goodsId : ${id}`);
    }
  }

  public async findMyGoodsNames(email: string): Promise<ApprovedGoodsNameAndId[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
        seller: { email },
        AND: {
          confirmation: {
            status: 'confirmed',
          },
          goods_status: 'normal',
        },
      },
      select: {
        confirmation: {
          select: {
            firstmallGoodsConnectionId: true,
          },
        },
        goods_name: true,
        id: true,
      },
    });
    const result = goodsIds.map((value) => {
      const { confirmation, ...rest } = value;
      const flattenResult = {
        ...rest,
        ...confirmation,
      };
      return flattenResult;
    });
    return result;
  }
}
