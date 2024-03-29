/* eslint-disable camelcase */
import { ObjectIdentifier } from '@aws-sdk/client-s3';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoodsImages, GoodsView, Seller } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminAllLcGoodsList,
  AllGoodsIdsRes,
  ApprovedGoodsListItem,
  DefaultPaginationDto,
  getLiveShoppingProgress,
  GoodsByIdRes,
  GoodsImageDto,
  GoodsListDto,
  GoodsListRes,
  GoodsOptionDto,
  GoodsOptionsWithSupplies,
  GoodsOptionWithStockInfo,
  GoodsOutlineByIdPaginationRes,
  GoodsOutlineByIdRes,
  RegistGoodsDto,
  TotalStockInfo,
} from '@project-lc/shared-types';
import { getImgSrcListFromHtmlStringList } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class GoodsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 판매자의 승인된 상품 ID 목록을 가져옵니다.
   * @param sellerId seller.id 로그인된 판매자 정보
   * @param ids? 특정 상품의 firstMallGoodsId만 조회하고 싶을 때
   */
  public async findMyGoodsIds(
    sellerId?: Seller['id'],
    ids?: number[],
  ): Promise<number[]> {
    const allGoods = await this.prisma.goods.findMany({
      where: {
        seller: sellerId ? { id: sellerId } : undefined,
        id: ids ? { in: ids } : undefined,
        AND: { confirmation: { status: 'confirmed' } },
      },
    });
    return allGoods.map((goods) => goods.id);
  }

  /**
   * 모든 상품 목록 조회
   * sellerId 이 주어지면 해당 판매자의 상품만 조회
   * dto : sellerId, page, itemPerPage, sort, direction
   * return : maxPage, totalItemCount, currentPage, prevPage, nextPage, items
   */
  public async getGoodsList({
    sellerId,
    page,
    itemPerPage,
    sort,
    direction,
    groupId,
    goodsName,
    categoryId,
  }: GoodsListDto & {
    sellerId?: number;
    goodsName?: string;
    categoryId?: number;
  }): Promise<GoodsListRes> {
    const items = await this.prisma.goods.findMany({
      skip: page * itemPerPage,
      take: itemPerPage,
      where: {
        seller: { id: sellerId },
        shippingGroupId: groupId,
        goods_name: {
          search: goodsName ? goodsName.trim() : undefined,
        },
        categories: { some: { id: categoryId } },
      },
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
      where: { seller: { id: sellerId } },
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
  // dto: sellerId, [itemId, itemId, ...]
  public async deleteLcGoods({
    sellerId,
    ids,
  }: {
    sellerId: number;
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
          seller: { id: sellerId },
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
    const s3ImageKeys = s3.getGoodsImageS3KeyListFromImgSrcList(imgSrcList);

    if (s3ImageKeys.length > 0) {
      let deleteObjectIdentifiers: ObjectIdentifier[] = [];

      deleteObjectIdentifiers = s3ImageKeys.map((key) => {
        return { Key: key };
      });
      s3.sendDeleteObjectsCommand({ deleteObjects: deleteObjectIdentifiers });
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
    const s3ImageKeys = s3.getGoodsImageS3KeyListFromImgSrcList(imageList);

    if (s3ImageKeys.length > 0) {
      let deleteObjectIdentifiers: ObjectIdentifier[] = [];

      deleteObjectIdentifiers = s3ImageKeys.map((key) => {
        return { Key: key };
      });
      s3.sendDeleteObjectsCommand({ deleteObjects: deleteObjectIdentifiers });
    }
  }

  // 노출여부 변경
  public async changeGoodsView(id: number, view: GoodsView): Promise<boolean> {
    try {
      await this.prisma.goods.update({
        where: { id },
        data: { goods_view: view },
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /** 상품 개별 정보 조회 */
  public async getOneGoods(goodsId: number): Promise<GoodsByIdRes> {
    const result = await this.prisma.goods.findFirst({
      where: { id: goodsId },
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
        image: { orderBy: { cut_number: 'asc' } },
        GoodsInfo: true,
        LiveShopping: {
          include: {
            broadcaster: { select: { id: true, userNickname: true, avatar: true } },
          },
        },
        productPromotion: {
          include: {
            broadcaster: { select: { id: true, userNickname: true, avatar: true } },
          },
        },
        categories: true,
        seller: {
          select: {
            id: true,
            name: true,
            avatar: true,
            email: true,
            agreementFlag: true,
            sellerShop: {
              select: {
                shopName: true,
              },
            },
          },
        },
        informationNotice: true,
      },
    });

    if (!result) return null;

    return {
      ...result,
      informationNotice: result.informationNotice
        ? {
            ...result.informationNotice,
            contents: result.informationNotice?.contents
              ? JSON.parse(result.informationNotice?.contents as string)
              : null,
          }
        : null,
    };
  }

  /** 상품 개별 간략 정보 조회 */
  public async getOneGoodsOutline(goodsId: number): Promise<GoodsOutlineByIdRes> {
    return this.prisma.goods.findFirst({
      where: { id: goodsId },
      select: {
        id: true,
        goods_name: true,
        summary: true,
        goods_status: true,
        options: { include: { supply: true } },
        confirmation: true,
        image: { orderBy: { cut_number: 'asc' } },
      },
    });
  }

  /** 카테고리 코드를 기준으로 상품 간략 정보 목록 조회 */
  public async getGoodsOutlineByCategory(
    categoryCode: string,
    paginationOpts?: DefaultPaginationDto,
  ): Promise<GoodsOutlineByIdPaginationRes> {
    const { skip, take } = paginationOpts;
    const realTake = take + 1;
    const result = await this.prisma.goods.findMany({
      skip,
      take: realTake,
      where: {
        OR: [
          { categories: { some: { categoryCode } } },
          { categories: { some: { parentCategory: { categoryCode } } } },
        ],
      },
      select: {
        id: true,
        goods_name: true,
        summary: true,
        goods_status: true,
        options: { include: { supply: true } },
        confirmation: true,
        image: { orderBy: { cut_number: 'asc' } },
      },
    });
    const resResult = result.slice(0, take);
    const hasNextPage = result.length === realTake;
    return {
      edges: resResult,
      hasNextPage,
      nextCursor: hasNextPage ? take + skip : undefined,
    };
  }

  // 상품 등록
  public async registGoods(
    sellerId: number,
    dto: RegistGoodsDto,
  ): Promise<{
    goodsId: number;
  }> {
    try {
      const {
        options,
        image,
        shippingGroupId,
        goodsInfoId,
        informationNoticeContents,
        searchKeywords,
        categoryIdList,
        ...goodsData
      } = dto;
      const optionsData = options.map((opt) => {
        const { supply, ...optData } = opt;
        return { ...optData, supply: { create: supply } };
      });
      const goods = await this.prisma.goods.create({
        data: {
          seller: { connect: { id: sellerId } },
          ...goodsData,
          searchKeyword: searchKeywords.map((k) => k.keyword).join(',') || undefined,
          options: { create: optionsData },
          image: { connect: image.map((img) => ({ id: img.id })) },
          ShippingGroup: shippingGroupId
            ? { connect: { id: shippingGroupId } }
            : undefined,
          GoodsInfo: goodsInfoId ? { connect: { id: goodsInfoId } } : undefined,
          confirmation: { create: { status: 'waiting' } },
          categories: { connect: categoryIdList.map((id) => ({ id })) },
          informationNotice: {
            create: { contents: JSON.stringify(JSON.parse(informationNoticeContents)) },
          },
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
      if (url.includes(s3.bucketDomain)) {
        const Key = url.replace(s3.bucketDomain, '');

        s3.sendDeleteObjectsCommand({ deleteObjects: [{ Key }] });
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

  /** 여러 상품 이미지 데이터 순서 수정 */
  public async updateGoodsImages(dto: GoodsImageDto[]): Promise<boolean> {
    await this.prisma.$transaction(
      dto.map((image) =>
        this.prisma.goodsImages.update({
          where: { id: image.id },
          data: { cut_number: image.cut_number },
        }),
      ),
    );
    return true;
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
      informationNoticeId,
      informationNoticeContents,
      searchKeywords,
      categoryIdList,
      ...goodsData
    } = dto;

    const { willBeCreatedOptions, willBeUpdatedOptions, willBeDeletedOptIds } =
      await this.distinguishOptions(id, comingOptions);

    const { status: prevStatus } = await this.prisma.goodsConfirmation.findFirst({
      where: { goodsId: id },
      select: { status: true },
    });

    // 이전에 연결된 카테고리 목록 조회
    const currentCategories = await this.prisma.goodsCategory.findMany({
      where: { goods: { some: { id } } },
      select: { id: true },
    });

    const currentCategoryIdList = currentCategories.map((cat) => cat.id);

    // 이전에 연결된 카테고리 목록에는 있으나, 수정dto에 없으면 카테고리 연결을 해제한다
    const disconnectCategoryIdList = currentCategoryIdList.filter(
      (currentCatId) => !categoryIdList.includes(currentCatId),
    );

    try {
      await this.prisma.goods.update({
        where: { id },
        data: {
          ...goodsData,
          searchKeyword: searchKeywords.map((k) => k.keyword).join(',') || undefined,
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
          image: { connect: image.map((img) => ({ id: img.id })) },
          ShippingGroup: shippingGroupId
            ? { connect: { id: shippingGroupId } }
            : undefined,
          GoodsInfo: goodsInfoId ? { connect: { id: goodsInfoId } } : undefined,
          informationNotice: {
            update: {
              contents: JSON.stringify(JSON.parse(informationNoticeContents)),
            },
          },
          categories: {
            connect: categoryIdList.map((_categoryId) => ({ id: _categoryId })),
            disconnect: disconnectCategoryIdList.map((_categoryId) => ({
              id: _categoryId,
            })),
          },
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

  public async findMyGoodsNames(sellerId: number): Promise<ApprovedGoodsListItem[]> {
    const goodsIds = await this.prisma.goods.findMany({
      where: {
        seller: { id: sellerId },
        AND: { goods_status: 'normal', confirmation: { status: { not: 'rejected' } } },
      },
      select: {
        confirmation: { select: { firstmallGoodsConnectionId: true } },
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

  /** 전체 상품목록 조회 -
   * 관리자에서 상품홍보에 연결하기 위한 상품(project-lc goods) 전체목록. 검수완료 & 정상판매중 일 것
   * goodsConfirmation.status === confirmed && goods.status === normal
   * goodsId, goodsName, sellerId, sellerEmail
   * */
  public async findAllConfirmedLcGoodsList(): Promise<AdminAllLcGoodsList> {
    return this.prisma.goods.findMany({
      where: {
        goods_status: 'normal',
        AND: {
          confirmation: {
            status: 'confirmed',
          },
        },
      },
      select: {
        id: true,
        goods_name: true,
        seller: { select: { id: true, email: true } },
      },
    });
  }

  /** 전체 상품목록 조회(카테고리 포함) -
   * 관리자에서 쿠폰에 연결하기 위한 상품(project-lc goods) 전체목록. 검수완료 & 정상판매중 일 것
   * goodsConfirmation.status === confirmed && goods.status === normal
   * goodsId, goodsName, sellerId, sellerEmail
   * */
  public async findAllConfirmedLcGoodsListWithCategory(): Promise<AdminAllLcGoodsList> {
    return this.prisma.goods.findMany({
      where: {
        goods_status: 'normal',
        AND: {
          confirmation: {
            status: 'confirmed',
          },
        },
      },
      select: {
        id: true,
        goods_name: true,
        seller: { select: { id: true, email: true } },
        categories: true,
      },
    });
  }

  /**
   * 상품 노출 여부를 조절하여 보이지 않도록 설정하지 않은 모든 상품의 상품번호를 반환합니다.
   */
  public async findAllGoodsIds(): Promise<AllGoodsIdsRes> {
    return this.prisma.goods.findMany({
      select: { id: true, goods_name: true },
      where: { confirmation: { status: 'confirmed' }, goods_view: { not: 'notLook' } },
    });
  }
}
