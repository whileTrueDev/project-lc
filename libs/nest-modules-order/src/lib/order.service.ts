import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateOrderDto, CreateOrderItemDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class OrderService extends ServiceBaseWithCache {
  #ORDER_CACHE_KEY = 'order';

  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  private hash(pw: string): string {
    return `${pw}hashed non member password`;
  }

  private handleNonMemberOrder(dto: CreateOrderDto): Partial<Prisma.OrderCreateInput> {
    const { nonMemberOrderFlag, nonMemberOrderPassword } = dto;
    return {
      nonMemberOrderFlag,
      nonMemberOrderPassword: nonMemberOrderFlag
        ? this.hash(nonMemberOrderPassword)
        : undefined,
    };
  }

  private async handleGiftOrder(
    dto: CreateOrderDto,
  ): Promise<Partial<Prisma.OrderCreateInput>> {
    const { orderItems } = dto;
    // 선물받을 대상 방송인 조회
    const { broadcasterId } = orderItems[0].support;
    const broadcaster = await this.broadcasterService.getBroadcaster({
      id: broadcasterId,
    });
    // 대상 방송인이 존재하지 않는경우 에러
    if (!broadcaster) {
      throw new BadRequestException(
        `후원 대상 방송인이 존재하지 않습니다 broadcasterId: ${broadcasterId}`,
      );
    }

    // 방송인의 주소, 연락처 조회
    const { broadcasterAddress, broadcasterContacts } = broadcaster;
    const defaultContact = broadcasterContacts.find(
      (contact) => contact.isDefault === true,
    );
    return {
      recipientName: defaultContact?.name || broadcaster.userNickname,
      recipientPhone:
        defaultContact?.phoneNumber || broadcasterContacts[0]?.phoneNumber || '',
      recipientEmail: defaultContact?.email || broadcasterContacts[0]?.email || '',
      recipientAddress: broadcasterAddress.address || '',
      recipientDetailAddress: broadcasterAddress.detailAddress || '',
      recipientPostalCode: broadcasterAddress.postalCode || '',
    };
  }

  private async calculateOrderPrice(orderItems: CreateOrderItemDto[]): Promise<number> {
    const goodsIdList = orderItems.map((item) => item.goodsId);
    const orderedItemGoods = await this.prisma.goods.findMany({
      where: { id: { in: goodsIdList } },
      select: {
        seller: {
          // 동일 판매자의 상품 합포장 처리 가능한지 확인위해
          select: { sellerShop: true },
        },
        options: { include: { supply: true } },
        ShippingGroup: {
          // 배송비 확인 위해
          include: {
            shippingSets: {
              include: { shippingOptions: { include: { shippingCost: true } } },
            },
          },
        },
      },
    });
    // const orderedGoodsData =
    return 0;
  }

  /** 주문생성 */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const { customerId, ...data } = dto;
    const { nonMemberOrderFlag, giftFlag, orderItems } = data;

    let createInput: Prisma.OrderCreateInput = {
      ...data,
      orderItems: undefined,
      customer: !nonMemberOrderFlag ? { connect: { id: customerId } } : undefined,
    };

    // 비회원 주문의 경우 비밀번호 해시처리
    if (nonMemberOrderFlag) {
      createInput = { ...createInput, ...this.handleNonMemberOrder(dto) };
    }

    // 선물하기의 경우(주문상품은 1개, 후원데이터가 존재함)
    if (giftFlag && orderItems.length === 1 && !!orderItems[0].support) {
      createInput = { ...createInput, ...(await this.handleGiftOrder(dto)) };
    }

    // 주문상품별 shippingCost + 주문상품옵션들의 discountPrice의 합 구해야함
    const orderPrice = await this.calculateOrderPrice(orderItems);
    createInput = { ...createInput, orderPrice };

    const order = await this.prisma.order.create({ data: createInput });

    return order;
  }

  /** 주문목록조회 */

  /** 개별주문조회 */

  /** 주문수정 */

  /** 주문 삭제 */
}
