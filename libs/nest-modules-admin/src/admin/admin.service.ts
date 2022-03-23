import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  AdminClassChangeHistory,
  Administrator,
  GoodsConfirmation,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminClassDto,
  AdminGoodsByIdRes,
  AdminGoodsListRes,
  AdminSettlementInfoType,
  BusinessRegistrationStatus,
  GoodsConfirmationDto,
  GoodsRejectionDto,
  LiveShoppingDTO,
  LiveShoppingImageDto,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 관리자 페이지 정산 데이터
  public async getSettlementInfo(): Promise<AdminSettlementInfoType> {
    // 전체 광고주를 기준으로 merge 한다.
    const users = await this.prisma.seller.findMany({
      include: {
        sellerBusinessRegistration: {
          include: {
            BusinessRegistrationConfirmation: true,
            seller: {
              select: {
                email: true,
                agreementFlag: true,
                inactiveFlag: false,
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
          take: 1,
        },
        sellerSettlementAccount: {
          orderBy: {
            id: 'desc',
          },
          include: {
            seller: {
              select: { email: true },
            },
          },
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
        result.sellerSettlementAccount.push(sellerSettlementAccount[0]);
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
      where: {
        confirmation: {
          OR: [{ status: 'waiting' }, { status: 'needReconfirmation' }],
        },
      },
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

  /** 동일한 퍼스트몰 상품 고유번호로 검수된 상품이 있는지 확인(중복 상품 연결 방지 위함) */
  private async checkDupFMGoodsConnectionId(fmGoodsId: number): Promise<boolean> {
    const confirmData = await this.prisma.goodsConfirmation.findFirst({
      where: { firstmallGoodsConnectionId: fmGoodsId },
    });
    const lv = await this.prisma.liveShopping.findFirst({
      where: { fmGoodsSeq: fmGoodsId },
    });
    const pp = await this.prisma.productPromotion.findFirst({
      where: { fmGoodsSeq: fmGoodsId },
    });
    if (confirmData || lv || pp) return true;
    return false;
  }

  public async setGoodsConfirmation(
    dto: GoodsConfirmationDto,
  ): Promise<GoodsConfirmation> {
    // 상품 검수 확인시 동일한 퍼스트몰 상품번호로 검수된 상품이 있는지(중복 여부) 확인 - 이미 존재하면 400 에러
    const { firstmallGoodsConnectionId } = dto;
    const hasDuplicatedFmGoodsConnectionId = await this.checkDupFMGoodsConnectionId(
      firstmallGoodsConnectionId,
    );

    if (hasDuplicatedFmGoodsConnectionId) {
      throw new BadRequestException(
        `이미 ( 퍼스트몰 상품 고유번호 : ${firstmallGoodsConnectionId} ) 로 검수된
        상품or라이브쇼핑or상품홍보가 존재합니다. 퍼스트몰 상품 고유번호를 다시 확인해주세요.`,
      );
    }
    // 동일한 퍼스트몰 상품번호로 검수된 상품이 없다면(중복이 아닌 경우) 그대로 검수 확인 진행
    const goodsConfirmation = await this.prisma.goodsConfirmation.update({
      where: { goodsId: dto.goodsId },
      data: {
        firstmallGoodsConnectionId,
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

  public async getOneGoods(goodsId: string | number): Promise<AdminGoodsByIdRes> {
    return this.prisma.goods.findFirst({
      where: {
        id: Number(goodsId),
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
        seller: true,
      },
    });
  }

  public async getRegisteredLiveShoppings(id?: string): Promise<LiveShoppingWithGoods[]> {
    return this.prisma.liveShopping.findMany({
      where: { id: id ? Number(id) : undefined },
      include: {
        goods: {
          select: { goods_name: true, summary: true, image: true, options: true },
        },
        seller: { select: { sellerShop: true } },
        broadcaster: {
          select: {
            id: true,
            userName: true,
            userNickname: true,
            email: true,
            avatar: true,
            BroadcasterPromotionPage: true,
          },
        },
        liveShoppingVideo: {
          select: { youtubeUrl: true },
        },
        images: true,
      },
      orderBy: { createDate: 'desc' },
    });
  }

  public async updateLiveShoppings(
    dto: LiveShoppingDTO,
    videoId?: number | null,
  ): Promise<boolean> {
    if (dto.fmGoodsSeq) {
      const isDuplicated = await this.checkDupFMGoodsConnectionId(Number(dto.fmGoodsSeq));
      if (isDuplicated)
        throw new BadRequestException(
          `이미 다른 상품or라이브쇼핑or상품홍보에 연결된 퍼스트몰 상품번호입니다.
          퍼스트몰 상품 고유번호를 다시 확인해주세요.`,
        );
    }
    const liveShoppingUpdate = await this.prisma.liveShopping.update({
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
        fmGoodsSeq: dto.fmGoodsSeq ? Number(dto.fmGoodsSeq) : undefined,
        liveShoppingName: dto.liveShoppingName || undefined,
      },
    });

    if (!liveShoppingUpdate) throw new InternalServerErrorException(`업데이트 실패`);
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

  /** 상품홍보 fmGoodsSeq 등록전 다른 곳에 등록된 fmGoodsSeq(goodsConfirmation, liveShopping) 과 중복되는지 확인
   * @return 중복되는 경우 true, 아니면 false
   */
  public async checkHasDuplicateFmGoodsSeq(goodsSeq: number): Promise<boolean> {
    // 상품검수 테이블 fmGoodsConnectionId와 중복되는 값이 있는지 확인
    const hasDuplicatedFmGoodsConnectionId = await this.checkDupFMGoodsConnectionId(
      goodsSeq,
    );

    if (hasDuplicatedFmGoodsConnectionId) return true;

    // 라이브쇼핑 테이블 fmGoodsSeq 와 중복값이 있는지 확인
    const duplicatedFmGoodsSeqLiveShopping = await this.prisma.liveShopping.findFirst({
      where: { fmGoodsSeq: goodsSeq },
    });

    if (duplicatedFmGoodsSeqLiveShopping) return true;

    // 상품홍보 테이블 fmGoodsSeq와 중복값 있는지 확인
    const duplicateFmGoodsSeqProductPromotion =
      await this.prisma.productPromotion.findFirst({
        where: { fmGoodsSeq: goodsSeq },
      });

    if (duplicateFmGoodsSeqProductPromotion) return true;

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
}
