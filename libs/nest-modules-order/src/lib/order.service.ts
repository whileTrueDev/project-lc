import {
  BadRequestException,
  CACHE_MANAGER,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Order, OrderProcessStep, Prisma } from '@prisma/client';
import { ServiceBaseWithCache, UserPwManager } from '@project-lc/nest-core';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderDto,
  GetNonMemberOrderDetailDto,
  GetOrderListDto,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import { Cache } from 'cache-manager';
import dayjs = require('dayjs');
import { nanoid } from 'nanoid';

@Injectable()
export class OrderService extends ServiceBaseWithCache {
  #ORDER_CACHE_KEY = 'order';

  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
    private readonly userPwManager: UserPwManager,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  private async hash(pw: string): Promise<string> {
    return this.userPwManager.hashPassword(pw);
  }

  /** 비회원주문생성시 처리 - 비회원주문비밀번호 암호화하여 리턴, nonMemberOrderFlag: true 설정 */
  private async handleNonMemberOrder(
    dto: CreateOrderDto,
  ): Promise<Partial<Prisma.OrderCreateInput>> {
    const { nonMemberOrderFlag, nonMemberOrderPassword } = dto;
    const hashedPassword = await this.hash(nonMemberOrderPassword);
    return {
      nonMemberOrderFlag,
      nonMemberOrderPassword: hashedPassword,
    };
  }

  /** 선물주문생성시 처리 - 방송인 정보(받는사람 주소, 연락처) 리턴, giftFlag: true 설정 */
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
      giftFlag: true,
      recipientName: defaultContact?.name || broadcaster.userNickname,
      recipientPhone:
        defaultContact?.phoneNumber || broadcasterContacts[0]?.phoneNumber || '',
      recipientEmail: defaultContact?.email || broadcasterContacts[0]?.email || '',
      recipientAddress: broadcasterAddress.address || '',
      recipientDetailAddress: broadcasterAddress.detailAddress || '',
      recipientPostalCode: broadcasterAddress.postalCode || '',
    };
  }

  /** 주문코드 생성 - 날짜시분초 + nanoid로 생성한 임의의문자열 조합 */
  private createOrderCode(): string {
    return dayjs().format('YYYYMMDDHHmmssSSS') + nanoid(6);
  }

  /** 주문에 포함된 주문상품에 후원정보가 포함되어 있는지 여부 리턴 */
  private hasSupportOrderItem(dto: CreateOrderDto): boolean {
    return (
      dto.orderItems.map((item) => item.support).filter((support) => !!support).length > 0
    );
  }

  private removeNonmemberOrderPassword(order: Order): Order {
    return {
      ...order,
      nonMemberOrderPassword: undefined,
    };
  }

  private removerecipientInfo(order: Order): Order {
    return {
      ...order,
      recipientName: '',
      recipientPhone: '',
      recipientEmail: '',
      recipientAddress: '',
      recipientDetailAddress: '',
      recipientPostalCode: '',
    };
  }

  /** 주문생성 */
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const { customerId, ...data } = dto;
    const { nonMemberOrderFlag, giftFlag, orderItems, payment, supportOrderIncludeFlag } =
      data;

    let createInput: Prisma.OrderCreateInput = {
      ...data,
      orderItems: undefined,
      orderCode: this.createOrderCode(),
      payment: payment ? { connect: { id: payment.id } } : undefined, // TODO: 결제api 작업 이후 CreateOrderDto에서 payment 값 필수로 바꾸고 이부분도 수정필요
      customer: !nonMemberOrderFlag ? { connect: { id: customerId } } : undefined,
    };

    // 비회원 주문의 경우 비밀번호 해시처리
    if (nonMemberOrderFlag) {
      createInput = { ...createInput, ...(await this.handleNonMemberOrder(dto)) };
    }

    // 선물하기의 경우(주문상품은 1개, 후원데이터가 존재함)
    if (giftFlag && orderItems.length === 1 && !!orderItems[0].support) {
      createInput = { ...createInput, ...(await this.handleGiftOrder(dto)) };
    }

    // 주문에 연결된 주문상품, 주문상품옵션, 주문상품후원 생성
    const order = await this.prisma.order.create({
      data: {
        ...createInput,
        supportOrderIncludeFlag: supportOrderIncludeFlag || this.hasSupportOrderItem(dto),
        orderItems: {
          // 주문에 연결된 주문상품 생성
          create: orderItems.map((item) => {
            const { options, support, ...rest } = item;
            return {
              ...rest,
              // 주문상품옵션들 생성
              options: { create: options },
              // 주문상품에 후원정보가 있는경우 주문상품후원생성
              support: support
                ? {
                    create: {
                      message: support.message,
                      nickname: support.nickname,
                      broadcaster: { connect: { id: support.broadcasterId } },
                    },
                  }
                : undefined,
            };
          }),
        },
      },
    });

    // TODO: 주문 생성 후 장바구니 비우기

    // 선물주문인경우 생성된 주문데이터에서 받는사람(방송인) 정보 삭제하고 리턴
    if (order.giftFlag) {
      return this.removerecipientInfo(order);
    }
    return order;
  }

  /** 주문목록조회시 사용할 findMany 인자 리턴
   * dto 에 포함된 값에 따라 where 절을 다르게 설정한다
   */
  private getOrderFindManyArgs(dto: GetOrderListDto): Prisma.OrderFindManyArgs {
    const {
      take,
      skip,
      customerId,
      sellerId,
      orderCode,
      periodStart,
      periodEnd,
      supportIncluded,
    } = dto;

    const args: Prisma.OrderFindManyArgs = {
      take,
      skip,
      include: {
        orderItems: {
          include: {
            support: true,
            options: true,
            goods: {
              select: {
                id: true,
                goods_name: true,
                image: true,
              },
            },
          },
        },
        payment: true,
      },
    };

    let where: Prisma.OrderWhereInput = {
      createDate: {
        gte: periodStart ? new Date(periodStart) : undefined,
        lte: periodEnd ? new Date(periodEnd) : undefined,
      },
    };

    // 특정 소비자의 주문목록 조회시
    if (customerId) {
      where = { ...where, customerId, deleteFlag: false };
    }

    // 특정 판매자가 판매하는 물건들의 주문목록 조회시
    if (sellerId) {
      where = { ...where, orderItems: { some: { goods: { sellerId } } } };
    }

    // 특정 주문코드 조회시
    if (orderCode) {
      where = { ...where, orderCode };
    }

    // 후원주문만 조회시
    if (supportIncluded) {
      where = { ...where, supportOrderIncludeFlag: true };
    }

    return { ...args, where };
  }

  /** 소비자 주문목록 후처리 =>  조회시 받는사람 정보 삭제 & 비회원비밀번호 정보 삭제
   // TODO: 리턴타입 수정
   */
  private postProcessCustomerOrderList(orders: Order[]): Order[] {
    return orders.map((order) => {
      if (order.giftFlag) return this.removerecipientInfo(order);
      if (order.nonMemberOrderFlag) return this.removeNonmemberOrderPassword(order);
      return order;
    });
  }

  /** 특정 소비자의 주문목록 조회 - 선물주문인 경우 받는사람 정보 삭제 후처리 추가 */
  async getCustomerOrderList(dto: GetOrderListDto): Promise<Order[]> {
    const orders = await this.getOrderList(dto);
    return this.postProcessCustomerOrderList(orders);
  }

  /** 전체 주문목록 조회 */
  async getOrderList(dto: GetOrderListDto): Promise<Order[]> {
    return this.prisma.order.findMany(this.getOrderFindManyArgs(dto));
  }

  /** 주문 상세조회 데이터 - 리턴데이터에 포함될것들 */
  private readonly getOrderDetailInput: Partial<Prisma.OrderFindUniqueArgs> = {
    include: {
      payment: true,
      orderItems: {
        include: {
          options: true,
          support: true,
          goods: {
            select: {
              id: true,
              goods_name: true,
              image: true,
            },
          },
        },
      },
      refunds: true,
      returns: true,
      exports: true,
      exchanges: true,
      orderCancellations: true,
    },
  };

  /** 개별주문조회 */
  async getOrderDetail(orderId: number): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, deleteFlag: false },
      ...this.getOrderDetailInput,
    });
    if (!order)
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문고유번호: ${orderId}`,
      );
    return order;
  }

  /** 비회원 주문 조회 */
  async getNonMemberOrderDetail({
    orderCode,
    password,
  }: GetNonMemberOrderDetailDto): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where: { orderCode, deleteFlag: false },
      ...this.getOrderDetailInput,
    });

    if (!order)
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문코드: ${orderCode}`,
      );

    const isPasswordCorrect = await this.userPwManager.validatePassword(
      password,
      order.nonMemberOrderPassword,
    );
    if (!isPasswordCorrect) {
      throw new BadRequestException(`주문 비밀번호가 일치하지 않습니다.`);
    }
    return order;
  }

  /** 주문수정 */
  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<boolean> {
    // 주문이 존재하는지 확인
    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
    });

    // 해당 주문이 없는경우 400 에러
    if (!order) {
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문고유번호 : ${orderId}`,
      );
    }

    const { customerId, nonMemberOrderPassword, ...rest } = dto;

    let updateInput: Prisma.OrderUpdateInput = { ...rest };

    // 연결된 소비자 수정하는경우
    if (customerId) {
      updateInput = {
        ...updateInput,
        customer: { connect: { id: customerId } },
      };
    }

    // 비회원 주문 비밀번호 바꾸는 경우
    if (nonMemberOrderPassword) {
      updateInput = {
        ...updateInput,
        nonMemberOrderPassword: await this.userPwManager.hashPassword(
          nonMemberOrderPassword,
        ),
      };
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: updateInput,
    });

    return true;
  }

  /** 주문 삭제 - 완료된 주문만 삭제 가능
   * 데이터 삭제x, deleteFlag를 true로 설정함 */
  async deleteOrder(orderId: number): Promise<boolean> {
    // 주문이 존재하는지 확인
    const order = await this.prisma.order.findFirst({
      where: { id: orderId, deleteFlag: false },
    });

    // 해당 주문이 없는경우 400 에러
    if (!order) {
      throw new BadRequestException(
        `해당 주문이 존재하지 않습니다. 주문고유번호 : ${orderId}`,
      );
    }

    // 완료된 주문이 아닌경우 403 에러
    if (order.step !== OrderProcessStep.shippingDone) {
      throw new ForbiddenException(`완료된 주문만 삭제 가능합니다`);
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { deleteFlag: true },
    });

    return true;
  }
}
