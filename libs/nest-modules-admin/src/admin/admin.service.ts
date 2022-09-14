import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  AdminClassChangeHistory,
  Administrator,
  GoodsConfirmation,
} from '@prisma/client';

import { CipherService } from '@project-lc/nest-modules-cipher';
import { ProductPromotionService } from '@project-lc/nest-modules-product-promotion';

import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminClassDto,
  AdminGoodsListRes,
  AdminLiveShoppingGiftOrder,
  AdminSettlementInfoType,
  GoodsConfirmationDto,
  GoodsRejectionDto,
  LiveShoppingUpdateDTO,
  LiveShoppingImageDto,
  LiveShoppingSpecialPriceUpdateDto,
} from '@project-lc/shared-types';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productPromotionService: ProductPromotionService,
    private readonly cipherService: CipherService,
  ) {}

  // 관리자 페이지 정산 데이터
  public async getSettlementInfo(): Promise<AdminSettlementInfoType> {
    // 전체 광고주를 기준으로 merge 한다.
    const users = await this.prisma.seller.findMany({
      include: {
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
            seller: { select: { email: true, agreementFlag: true, inactiveFlag: false } },
          },
          orderBy: { id: 'desc' },
          take: 1,
        },
        sellerSettlementAccount: {
          orderBy: { id: 'desc' },
          include: { seller: { select: { email: true } } },
          take: 1,
        },
      },
    });

    const result = this.preprocessSettlementInfo(users);
    return result;
  }

  // 정산정보 전처리
  private preprocessSettlementInfo(users: any): AdminSettlementInfoType {
    const result: AdminSettlementInfoType = {
      sellerSettlementAccount: [],
      sellerBusinessRegistration: [],
    };

    // 단순 데이터를 전달하지 않고 필요한 데이터의형태로 정제해야함.
    users.forEach(({ sellerSettlementAccount, sellerBusinessRegistration }) => {
      if (sellerSettlementAccount.length > 0) {
        // 암호화된 계좌번호 복호화처리
        const { number } = sellerSettlementAccount[0];
        const decryptedSettlementAccount = this.cipherService.getDecryptedText(number);
        result.sellerSettlementAccount.push({
          ...sellerSettlementAccount[0],
          number: decryptedSettlementAccount,
        });
      }
      if (sellerBusinessRegistration.length > 0) {
        result.sellerBusinessRegistration.push(sellerBusinessRegistration[0]);
      }
    });

    return result;
  }

  /**
   * 각 상품의 판매자의 사업자등록정보 검수 여부를 판별하기 위한 Map 반환
   * @returns (판매자의 ID - 사업자등록정보 검수 결과)의 (key-value)를 가진 Map
   */
  public async getConfirmedSellers(): Promise<Map<number, string>> {
    const sellers = await this.prisma.seller.findMany({
      where: {
        inactiveFlag: false,
      },
      include: {
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
      },
    });

    const confirmedSellers = sellers.reduce((map, seller) => {
      if (seller.sellerBusinessRegistration.length > 0) {
        const { BusinessRegistrationConfirmation } = seller.sellerBusinessRegistration[0];
        map.set(seller.id, BusinessRegistrationConfirmation.status);
      }
      return map;
    }, new Map<number, string>());

    return confirmedSellers;
  }

  // 관리자 페이지 상품검수 데이터, 상품검수가 완료되지 않은 상태일 경우,
  public async getGoodsInfo({ sort, direction }): Promise<AdminGoodsListRes> {
    const items = await this.prisma.goods.findMany({
      orderBy: [{ [sort]: direction }],
      include: {
        options: {
          include: {
            supply: true,
          },
        },
        confirmation: true,
        ShippingGroup: true,
        seller: {
          select: {
            name: true,
            agreementFlag: true,
          },
        },
      },
    });

    // 판매자의 사업자등록 검수 여부 상태를 조회하는 map사용
    const confirmedSellers = await this.getConfirmedSellers();

    const list = items.map((item) => {
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
        confirmation: item.confirmation,
        name: item.seller.name,
        agreementFlag: item.seller.agreementFlag,
        shippingGroup: item.ShippingGroup
          ? {
              id: item.ShippingGroup.id,
              shipping_group_name: item.ShippingGroup.shipping_group_name,
            }
          : undefined,
        businessRegistrationStatus: confirmedSellers.get(item.sellerId),
      };
    });

    return {
      items: list,
      totalItemCount: items.length,
    };
  }

  /** 상품 검수 여부 변경 */
  public async setGoodsConfirmation(
    dto: GoodsConfirmationDto,
  ): Promise<GoodsConfirmation> {
    const goodsConfirmation = await this.prisma.goodsConfirmation.update({
      where: { goodsId: dto.goodsId },
      data: {
        firstmallGoodsConnectionId: null,
        status: dto.status,
        rejectionReason: null,
      },
    });
    if (!goodsConfirmation) throw new InternalServerErrorException(`승인 상태 변경불가`);
    return goodsConfirmation;
  }

  public async setGoodsRejection(dto: GoodsRejectionDto): Promise<GoodsConfirmation> {
    const goodsConfirmation = await this.prisma.goodsConfirmation.update({
      where: { goodsId: dto.goodsId },
      data: {
        status: dto.status,
        rejectionReason: dto.rejectionReason,
      },
    });

    if (!goodsConfirmation) {
      throw new InternalServerErrorException(`승인 상태 변경불가`);
    }

    return goodsConfirmation;
  }

  public async updateLiveShoppings(
    dto: LiveShoppingUpdateDTO,
    videoId?: number | null,
  ): Promise<boolean> {
    const liveShoppingUpdate = await this.prisma.$transaction(async (transac) => {
      const result = await transac.liveShopping.update({
        where: { id: Number(dto.id) },
        data: {
          progress: dto.progress || undefined,
          broadcasterId: dto.broadcasterId || undefined,
          broadcastStartDate: dto.broadcastStartDate
            ? new Date(dto.broadcastStartDate)
            : undefined,
          broadcastEndDate: dto.broadcastEndDate
            ? new Date(dto.broadcastEndDate)
            : undefined,
          sellStartDate: dto.sellStartDate ? new Date(dto.sellStartDate) : undefined,
          sellEndDate: dto.sellEndDate ? new Date(dto.sellEndDate) : undefined,
          rejectionReason: dto.rejectionReason || undefined,
          videoId: videoId || undefined,
          whiletrueCommissionRate: dto.whiletrueCommissionRate || 0,
          broadcasterCommissionRate: dto.broadcasterCommissionRate || 0,
          liveShoppingName: dto.liveShoppingName || undefined,
          messageSetting: {
            upsert: {
              create: {
                fanNick: dto.messageSetting.fanNick || undefined,
                levelCutOffPoint: dto.messageSetting.levelCutOffPoint || undefined,
                ttsSetting: dto.messageSetting.ttsSetting || undefined,
              },
              update: {
                fanNick: dto.messageSetting.fanNick || undefined,
                levelCutOffPoint: dto.messageSetting.levelCutOffPoint || undefined,
                ttsSetting: dto.messageSetting.ttsSetting || undefined,
              },
            },
          },
        },
      });

      // 취소상태로 변경하는 경우
      if (dto.progress === 'canceled') {
        // 카트상품 channel 변경
        await transac.cartItem.updateMany({
          data: { channel: 'normal' },
          where: {
            support: { liveShoppingId: dto.id, AND: { productPromotion: { is: null } } },
          },
        });
        // 카트상품 channel 변경
        await transac.cartItem.updateMany({
          data: { channel: 'productPromotion' },
          where: {
            support: {
              liveShoppingId: dto.id,
              AND: { productPromotion: { isNot: null } },
            },
          },
        });
        // 해당 라이브쇼핑이 연결된 카트 응원메시지 삭제 (상품홍보가 연결되어있다면 pass)
        await transac.cartItemSupport.deleteMany({
          where: { liveShoppingId: dto.id, AND: { productPromotion: { is: null } } },
        });
      }
      return result;
    });
    if (!liveShoppingUpdate) throw new InternalServerErrorException(`업데이트 실패`);

    // 방송인을 등록하는 경우 && 라이브쇼핑 연결된 상품이 크크쇼에 등록된 상품인 경우  => 해당방송인의 상품홍보페이지에 라이브쇼핑 진행상품 등록
    if (dto.broadcasterId && liveShoppingUpdate?.goodsId) {
      try {
        const liveshoppingKkshowGoodsId = liveShoppingUpdate.goodsId;
        const { broadcasterId } = dto;
        await this.productPromotionService.createProductPromotion({
          goodsId: liveshoppingKkshowGoodsId,
          broadcasterId,
        });
      } catch (e) {
        throw new InternalServerErrorException(
          // e,
          `방송인의 상품홍보페이지에 라이브쇼핑 진행상품 등록 오류, 방송인 고유번호 : ${dto.broadcasterId}`,
        );
      }
    }

    return true;
  }

  async upsertLiveShoppingImage({
    liveShoppingId,
    imageType,
    imageUrl,
  }: LiveShoppingImageDto): Promise<boolean> {
    if (liveShoppingId) {
      const existImage = await this.prisma.liveShoppingImage.findFirst({
        where: {
          liveShoppingId,
          type: imageType,
        },
      });

      if (existImage) {
        await this.prisma.liveShoppingImage.update({
          where: { id: existImage.id },
          data: {
            imageUrl,
          },
        });
      } else {
        await this.prisma.liveShoppingImage.create({
          data: {
            type: imageType,
            imageUrl,
            liveShopping: { connect: { id: liveShoppingId } },
          },
        });
      }
    }
    return true;
  }

  public async registVideoUrl(url: string): Promise<number> {
    const videoUrl = await this.prisma.liveShoppingVideo.create({
      data: { youtubeUrl: url || undefined },
    });
    if (!videoUrl) throw new InternalServerErrorException(`비디오 등록 실패`);
    return videoUrl.id;
  }

  public async deleteVideoUrl(liveShoppingId: number): Promise<boolean> {
    const videoUrl = await this.prisma.liveShopping.update({
      where: { id: Number(liveShoppingId) },
      data: { liveShoppingVideo: { delete: true } },
    });
    if (!videoUrl) throw new InternalServerErrorException(`비디오 삭제 실패`);
    return true;
  }

  /** 라이브쇼핑 특가정보 수정 */
  public async updateLiveShoppingSpecialPrice({
    id,
    specialPrice,
    goodsId,
    goodsOptionId,
    liveShoppingId,
    discountType,
  }: { id: number } & LiveShoppingSpecialPriceUpdateDto): Promise<boolean> {
    const existSpecialPrice = await this.prisma.liveShoppingSpecialPrice.findUnique({
      where: { id },
    });
    if (existSpecialPrice) {
      await this.prisma.liveShoppingSpecialPrice.update({
        where: { id },
        data: { specialPrice },
      });
    } else {
      await this.prisma.liveShoppingSpecialPrice.create({
        data: {
          specialPrice,
          goodsId,
          goodsOptionId,
          liveShoppingId,
          discountType,
        },
      });
    }

    return true;
  }

  /**
   * 고정 판매 수수료율을 변경합니다.
   * @param commissionRate 변경할 수수료율 5, 10 과 같은 100이하, 0이상의 숫자
   * @returns 업데이트 성공 여부 boolean
   */
  public async updateSellCommission(commissionRate: string): Promise<boolean> {
    const result = await this.prisma.sellCommission.update({
      data: {
        commissionRate,
        commissionDecimal: Number(commissionRate) * 0.01,
      },
      where: { id: 1 },
    });

    if (result) return true;
    return false;
  }

  public async getAdminUserList(): Promise<AdminClassDto[]> {
    return this.prisma.administrator.findMany({
      select: {
        id: true,
        email: true,
        adminClass: true,
      },
    });
  }

  public async updateAdminClass(dto: AdminClassDto): Promise<Administrator> {
    return this.prisma.administrator.update({
      where: {
        email: dto.email,
      },
      data: {
        adminClass: dto.adminClass,
      },
    });
  }

  public async deleteAdminUser(id: number): Promise<boolean> {
    const doDelete = await this.prisma.administrator.delete({
      where: {
        id: Number(id),
      },
    });
    if (doDelete) return true;
    return false;
  }

  public async createAdminClassChangeHistory(dto): Promise<AdminClassChangeHistory> {
    return this.prisma.adminClassChangeHistory.create({
      data: {
        adminEmail: dto.adminEmail,
        targetEmail: dto.targetEmail,
        originalAdminClass: dto.originalAdminClass,
        newAdminClass: dto.newAdminClass,
      },
    });
  }

  /** 라이브쇼핑 선물주문 목록 조회
   * 라이브쇼핑 판매시작일시~판매종료일시 생성된 선물 주문 중 주문상태가 주문무효 주문취소 등의 상태가 아닌 주문 중
   * 라이브쇼핑 진행한 상품이 주문상품으로 포함 && 주문상품에 라이브쇼핑 진행한 방송인이 후원으로 연결된 주문
   */
  public async getLiveShoppingGiftOrders(
    liveShoppingId: number,
  ): Promise<AdminLiveShoppingGiftOrder[]> {
    const liveShopping = await this.prisma.liveShopping.findUnique({
      where: { id: liveShoppingId },
    });

    const { goodsId, broadcasterId, sellStartDate, sellEndDate } = liveShopping;

    const giftOrders = await this.prisma.order.findMany({
      where: {
        createDate: {
          gte: sellStartDate ? new Date(sellStartDate) : undefined,
          lte: sellEndDate ? new Date(sellEndDate) : undefined,
        },
        orderItems: {
          some: {
            goodsId,
            support: { broadcasterId },
            options: {
              some: {
                step: {
                  in: [
                    'orderReceived',
                    'paymentConfirmed',
                    'goodsReady',
                    'partialExportReady',
                    'exportReady',
                    'partialExportDone',
                    'exportDone',
                    'partialShipping',
                    'shipping',
                    'partialShippingDone',
                    'shippingDone',
                    'purchaseConfirmed',
                  ],
                },
              },
            },
          },
        },
        giftFlag: true,
      },
      orderBy: { createDate: 'desc' },
      include: {
        orderItems: {
          include: {
            options: true,
            support: {
              include: { broadcaster: { select: { userNickname: true, avatar: true } } },
            },
            goods: {
              select: {
                id: true,
                goods_name: true,
                seller: { select: { sellerShop: { select: { shopName: true } } } },
              },
            },
          },
        },
      },
    });

    // 라이브쇼핑 진행한 주문상품만 필터링
    const giftOrdersFilterByGoodsId = giftOrders.map((order) => {
      const { orderItems, ...rest } = order;
      const filtered = orderItems.filter((item) => item.goodsId === goodsId);
      return {
        ...rest,
        orderItems: filtered,
      };
    });

    return giftOrdersFilterByGoodsId;
  }
}
