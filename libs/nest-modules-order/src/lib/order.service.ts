import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CouponStatus,
  Goods,
  GoodsOptions,
  MileageActionType,
  Order,
  OrderItemOption,
  OrderProcessStep,
  OrderShipping,
  Prisma,
  SellType,
  TtsSetting,
} from '@prisma/client';
import { MICROSERVICE_OVERLAY_TOKEN } from '@project-lc/nest-core';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { CustomerCouponService } from '@project-lc/nest-modules-coupon';
import { PurchaseMessageService } from '@project-lc/nest-modules-liveshopping';
import { MileageService, MileageSettingService } from '@project-lc/nest-modules-mileage';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateOrderDto,
  CreateOrderItemDto,
  CreateOrderShippingData,
  FindAllOrderByBroadcasterRes,
  FindManyDto,
  GetNonMemberOrderDetailDto,
  GetOneOrderDetailDto,
  GetOrderListDto,
  getOrderProcessStepNameByStringNumber,
  NonMemberOrderDetailRes,
  OrderDataWithRelations,
  OrderDetailRes,
  orderEndSteps,
  OrderListRes,
  orderProcessStepDict,
  OrderPurchaseConfirmationDto,
  OrderShippingCheckDto,
  OrderStatsRes,
  OrderStatusNumString,
  purchaseConfirmAbleSteps,
  PurchaseMessage,
  sellerOrderSteps,
  ShippingCheckItem,
  ShippingCostByShippingGroupId,
  skipSteps,
  UpdateOrderDto,
} from '@project-lc/shared-types';
import { calculateShippingCost, getOrderItemOptionSteps } from '@project-lc/utils';
import { nanoid } from 'nanoid';
import dayjs = require('dayjs');
import isToday = require('dayjs/plugin/isToday');
import { CipherService } from '@project-lc/nest-modules-cipher';

dayjs.extend(isToday);

@Injectable()
export class OrderService {
  private logger = new Logger(OrderService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
    private readonly customerCouponService: CustomerCouponService,
    private readonly mileageService: MileageService,
    private readonly mileageSettingService: MileageSettingService,
    private readonly purchaseMessageService: PurchaseMessageService,
    private readonly cipherService: CipherService,
    @Inject(MICROSERVICE_OVERLAY_TOKEN) private readonly microService: ClientProxy,
  ) {}

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
    const defaultContact =
      broadcasterContacts.find((contact) => contact.isDefault === true) ||
      broadcasterContacts[0];

    let phone = defaultContact?.phoneNumber || '';
    // Broadcaster.phoneNumber 000-0000-0000 형태로 저장됨 => Order.recipientPhone은 '-' 없는 00000000000 형태로 저장
    if (phone.includes('-')) {
      phone = defaultContact.phoneNumber.split('-').join('');
    }

    return {
      giftFlag: true,
      recipientName: defaultContact?.name || broadcaster.userNickname,
      recipientPhone: phone,
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

  /** 주문에서 주문자 정보 빈 문자열로 바꿔서 리턴 */
  private removeRecipientInfo<T extends Order>(order: T): T {
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

  /** 주문 상세조회(OrderDetailRes) 데이터에서
   * 출고정보 중 택배사(deliveryCompany), 운송장번호(deliveryNumber) 삭제
   *
   * 주문 목록 조회는 출고데이터를 포함하지 않으므로 주문상세조회 응답값에만 해당 함수 적용함
   * */
  private removeDeliveryCompanyAndDeliveryNumber(order: OrderDetailRes): OrderDetailRes {
    const { exports } = order;
    // 출고정보가 없는경우 그대로 리턴
    if (!exports || exports.length === 0) {
      return order;
    }
    // 출고정보가 있는경우, 출고정보에서 deliveryCompany, deliveryNumber 삭제하고 리턴
    const exportsDeliveryCompanyAndDeliveryNumberRemoved = exports.map((ex) => {
      return {
        ...ex,
        deliveryCompany: '',
        deliveryNumber: '',
      };
    });

    return {
      ...order,
      exports: exportsDeliveryCompanyAndDeliveryNumberRemoved,
    };
  }

  /** 주문에 포함된 배송비정보 생성 */
  async createOrderShippingData(
    orderId: number,
    shippingData: CreateOrderShippingData[],
  ): Promise<OrderShipping[]> {
    // 주문에 연결된 주문상품 조회
    const createdOrderItems = await this.prisma.orderItem.findMany({
      where: { orderId },
    });

    return this.prisma.$transaction(
      shippingData.map((_shippingData) => {
        const { shippingCost, shippingGroupId, items } = _shippingData;

        // goodsId로 배송비에 포함된 주문상품 찾기
        const relatedOrderItemsIdList = createdOrderItems
          .filter((item) => {
            const { goodsId } = item;
            return items.includes(goodsId);
          })
          .map((item) => ({ id: item.id }));

        return this.prisma.orderShipping.create({
          data: {
            order: { connect: { id: orderId } },
            shippingGroup: { connect: { id: shippingGroupId } },
            shippingCost: String(shippingCost),
            items: { connect: relatedOrderItemsIdList },
          },
        });
      }),
    );
  }

  /** 주문생성시 사용. paymentId 가 있는 경우 결제완료 여부 확인하여 주문의 초기 상태 구하는 함수 */
  private async getInitialOrderStep({
    paymentId,
  }: {
    paymentId?: number;
  }): Promise<OrderProcessStep> {
    let orderStep: OrderProcessStep = 'orderReceived';

    if (!paymentId) return orderStep;

    // 결제정보 조회
    const paymentInfo = await this.prisma.orderPayment.findUnique({
      where: { id: paymentId },
    });
    if (!paymentInfo) return orderStep;

    if (paymentInfo.method === 'virtualAccount') {
      // 가상계좌 결제 && 가상계좌에 입금 완료시
      if (
        paymentInfo.depositStatus === 'DONE' &&
        paymentInfo.depositDoneFlag &&
        paymentInfo.depositDate
      ) {
        orderStep = 'paymentConfirmed';
      }
    }
    // 카드결제 OR 계좌이체 결제시
    if (['card', 'transfer'].includes(paymentInfo.method) && paymentInfo.depositDate) {
      orderStep = 'paymentConfirmed';
    }
    return orderStep;
  }

  /** OrderCreateInput['orderItems']['create'] 주문create 중 orderItems create 부분 생성  */
  private async getOrderItemsCreateInput({
    orderItems,
    orderStep,
  }: {
    orderItems: CreateOrderItemDto[];
    orderStep: OrderProcessStep;
  }): Promise<Prisma.OrderCreateInput['orderItems']['create']> {
    // 주문에 연결될 상품 정보 조회
    const orderItemsConnectedGoodsIds = orderItems.map((i) => i.goodsId);
    const orderItemConnectedGoodsData = await this.prisma.goods.findMany({
      where: { id: { in: orderItemsConnectedGoodsIds } },
      select: { id: true, goods_name: true, image: true, options: true },
    });

    // 주문상품과 연결된 후원 라이브방송들 정보 찾기
    const supportedLiveShoppingIdList = orderItems
      .filter((oi) => !!oi.support)
      .map((oi) => oi.support.liveShoppingId);
    const relatedLiveShoppings = await this.prisma.liveShopping.findMany({
      where: { id: { in: supportedLiveShoppingIdList } },
      include: { liveShoppingSpecialPrices: true },
    });

    return orderItems.map((item) => {
      const { options, support, goodsName, goodsId, channel, shippingGroupId } = item;

      const supportLs =
        relatedLiveShoppings.length > 0 && !!support
          ? relatedLiveShoppings.find((ls) => ls.id === support.liveShoppingId)
          : undefined;

      const connectedGoodsData = orderItemConnectedGoodsData.find(
        (goodsData) => goodsData.id === item.goodsId,
      );
      // 상품대표이미지(이미지 중 첫번째)
      const imageUrl = connectedGoodsData?.image[0]?.image;

      return {
        goodsId,
        channel,
        shippingGroupId,
        // 주문상품옵션들 생성
        options: {
          create: options.map((opt) => {
            const specialPriceData = supportLs?.liveShoppingSpecialPrices.find(
              (sp) => sp.goodsOptionId === opt.goodsOptionId,
            );
            const liveShoppingSpecialPriceId = specialPriceData
              ? specialPriceData.id
              : undefined;
            return {
              ...opt,
              goodsName,
              imageUrl,
              step: orderStep,
              discountPrice: opt.discountPrice, // 주문 & 결제당시 크크쇼주문스토어에 저장된 가격
              liveShoppingSpecialPriceId, // 라이브쇼핑 특가 정보 연결(존재하는 경우)
            };
          }),
        },
        // 주문상품에 후원정보가 있는경우 주문상품후원생성
        support: support
          ? {
              create: {
                broadcasterId: support.broadcasterId,
                message: support?.message,
                nickname: support?.nickname,
                liveShoppingId: support?.liveShoppingId,
                productPromotionId: support?.productPromotionId,
              },
            }
          : undefined,
      };
    });
  }

  /** 주문생성 */
  async createOrder({
    orderDto,
    shippingData,
  }: {
    orderDto: CreateOrderDto;
    shippingData: CreateOrderShippingData[];
  }): Promise<Order> {
    const {
      customerId,
      cartItemIdList,
      usedMileageAmount,
      couponId,
      paymentId,
      nonMemberOrderFlag,
      giftFlag,
      orderItems,
      supportOrderIncludeFlag,
      orderCode,
    } = orderDto;

    let createInput: Prisma.OrderCreateInput = {
      orderCode: orderCode || this.createOrderCode(),
      customer: !nonMemberOrderFlag ? { connect: { id: customerId } } : undefined,
      payment: paymentId ? { connect: { id: paymentId } } : undefined,
      orderItems: undefined,
      orderPrice: orderDto.orderPrice,
      paymentPrice: orderDto.paymentPrice,
      recipientName: orderDto.recipientName,
      recipientPhone: orderDto.recipientPhone,
      recipientEmail: orderDto.recipientEmail,
      recipientAddress: orderDto.recipientAddress,
      recipientDetailAddress: orderDto.recipientDetailAddress,
      recipientPostalCode: orderDto.recipientPostalCode,
      ordererName: orderDto.ordererName,
      ordererPhone: orderDto.ordererPhone,
      ordererEmail: orderDto.ordererEmail,
      memo: orderDto.memo,
      cashReceipts: orderDto.cashReceipts,
      nonMemberOrderFlag,
    };

    // 선물하기의 경우(주문상품은 1개, 후원데이터가 존재함)
    if (giftFlag && orderItems.length === 1 && !!orderItems[0].support) {
      createInput = { ...createInput, ...(await this.handleGiftOrder(orderDto)) };
    }

    // 주문 기본 상태 설정 (결제완료시 결제확인, 이외의 경우 주문접수)
    const orderStep = await this.getInitialOrderStep({ paymentId });

    const orderItemsCreateInput = await this.getOrderItemsCreateInput({
      orderItems,
      orderStep,
    });

    // 주문상품, 주문상품옵션, 주문상품후원 생성
    const order = await this.prisma.order.create({
      data: {
        ...createInput,
        supportOrderIncludeFlag:
          supportOrderIncludeFlag || this.hasSupportOrderItem(orderDto),
        orderItems: { create: orderItemsCreateInput },
      },
    });

    /** *************** */
    // * 주문에 부과된 배송비정보(OrderShipping) 생성
    await this.createOrderShippingData(order.id, shippingData);
    /** *************** */

    // 비회원 주문이 아닌경우 - 마일리지, 쿠폰사용처리
    if (!nonMemberOrderFlag) {
      // 마일리지 사용시
      if (usedMileageAmount) {
        // * 마일리지 차감 처리 customerId, usedMileageAmount
        await this.mileageService.upsertMileage({
          customerId,
          mileage: usedMileageAmount,
          actionType: MileageActionType.consume,
          reason: `주문 ${order.orderCode} 에 적립금 ${usedMileageAmount} 사용`,
          orderId: order.id,
        });
      }

      // 쿠폰 사용시
      if (couponId) {
        // * 쿠폰 사용처리 customerId, couponId, usedCouponAmount
        await this.customerCouponService.updateCustomerCouponStatus({
          id: couponId,
          status: CouponStatus.used,
          orderId: order.id,
        });
      }
    }

    // * 주문 생성 후 장바구니 비우기
    if (cartItemIdList) {
      await this.prisma.cartItem.deleteMany({
        where: { id: { in: cartItemIdList } },
      });
    }

    // 선물주문인경우 생성된 주문데이터에서 받는사람(방송인) 정보 삭제하고 리턴
    if (order.giftFlag) {
      return this.removeRecipientInfo(order);
    }

    return order;
  }

  /** 주문정보에 따른 구매메시지 송출 함수 (microservice 호출만 합니다. 실제 송출은 overlay에서 진행됨.) */
  public async triggerPurchaseMessage(order: CreateOrderDto): Promise<void> {
    const { orderItems, giftFlag, nonMemberOrderFlag } = order;
    const liveShoppingIds = orderItems
      .map((oi) => oi.support?.liveShoppingId)
      .filter((li) => !!li);
    const liveShoppingMsgSettings = await this.prisma.liveShoppingMessageSetting.findMany(
      { where: { liveShoppingId: { in: liveShoppingIds } } },
    );
    type TempPurchaseMessageAdditional = {
      broadcasterId: number;
      liveShoppingId?: number;
    };
    type TempPurchaseMessage = Omit<PurchaseMessage, 'roomName'> &
      TempPurchaseMessageAdditional;
    // orderItems를 구매메시지 데이터로 전환
    const messageDataArr = orderItems
      .filter((x) => x.channel === SellType.liveShopping && x.support)
      .map<TempPurchaseMessage>((x) => {
        const setting = liveShoppingMsgSettings.find(
          (set) => set.liveShoppingId === x.support.liveShoppingId,
        );
        const purchaseNum = x.options.reduce(
          (acc, curr) => acc + curr.discountPrice * curr.quantity,
          0,
        );
        return {
          broadcasterId: x.support.broadcasterId,
          productName: x.goodsName,
          purchaseNum,
          nickname: x.support?.nickname || setting?.fanNick || '익명의구매자',
          message: giftFlag
            ? `[방송인에게 선물!] ${x.support.message}`
            : x.support.message || '',
          ttsSetting: setting?.ttsSetting || TtsSetting.full,
          level: setting?.levelCutOffPoint < purchaseNum ? '2' : '1',
          giftFlag,
          liveShoppingId: x.support.liveShoppingId,
          simpleMessageFlag: !x.support?.nickname, // 닉네임이 없는 경우 간단 메시지 송출 + 랭킹반영X
        };
      });
    // orderItems를 구매메시지 데이터로 전환한 배열의 각 송출 overlay 채널을 조회
    const bcIds = messageDataArr.map((x) => x.broadcasterId);
    const bcOverlayUrls = await this.prisma.broadcaster.findMany({
      where: { id: { in: bcIds } },
      select: { overlayUrl: true, id: true },
    });
    // 구매 메시지 데이터 구성
    const purchaseData = messageDataArr
      .map<PurchaseMessage & TempPurchaseMessageAdditional>((y) => ({
        ...y,
        roomName: bcOverlayUrls
          .find((b) => b.id === y.broadcasterId)
          ?.overlayUrl.replace('/', ''),
      }))
      .filter((z) => !!z.roomName);

    // 구매메시지 테이블(LiveShoppingPurchaseMessage)에 데이터 저장
    await Promise.all(
      purchaseData.map((purchase) => {
        return this.purchaseMessageService.uploadPurchaseMessage({
          email: purchase.roomName,
          level: purchase.level,
          liveShoppingId: purchase.liveShoppingId,
          loginFlag: !purchase.simpleMessageFlag,
          message: purchase.message,
          nickname: purchase.nickname,
          productName: purchase.productName,
          purchaseNum: purchase.purchaseNum,
          ttsSetting: purchase.ttsSetting,
          giftFlag: purchase.giftFlag || false,
          phoneCallEventFlag: false,
        });
      }),
    );
    // 구매 메시지 송출 요청
    purchaseData.forEach((data) => {
      this.logger.debug(
        `구매 메시지 송출 이벤트 트리거 API -> Overlay - ${data.roomName} (liveShoppingId: ${data.liveShoppingId}) - ${data.productName} ${data.nickname}::${data.message}`,
      );
      this.microService.emit<void, PurchaseMessage>(
        'liveshopping:overlay:purchase-msg',
        data,
      );
    });
  }

  /** 주문목록조회시 사용할 where값 리턴
   * dto 에 포함된 값에 따라 where 절을 다르게 설정한다
   */
  private getOrderListFilterWhere(dto: GetOrderListDto): Prisma.OrderWhereInput {
    const {
      customerId,
      sellerId,
      orderCode,
      periodStart,
      periodEnd,
      supportIncluded,
      search,
      searchDateType,
      searchStatuses,
      searchExtendedStatus,
    } = dto;

    let where: Prisma.OrderWhereInput = {};
    // 특정 소비자의 주문목록 조회시
    if (customerId) {
      where = {
        ...where,
        customerId,
        deleteFlag: false,
        // 주문에 포함된 "모든 주문상품옵션"이 대해 환불 or 교환 or 주문취소 생성한 주문은 제외한다 (220712 기준 주문 일부상품에 대해서만 교환/환불 신청을 할 수 있다)
        // refund 는 Return, OrderCancellation 이 완료된 이후 생기는 데이터므로 orderCancellation, return 데이터만 확인하면 됨
        /** 클라이언트에서 주문목록.filter(조건) 로 처리하지 않고 where절 사용한 이유 :
         * 서버세서는 5개씩 조회하여 클라이언트로 응답했는데
         * 그 5개 모두 교환/환불/취소 요청이 존재하는 주문이라 클라이언트에서 필터링되는 경우가 있을 수 있다
         * 이 경우 서버에서 5개를 응답하였음에도 소비자 주문목록에는 아무것도 표시되지 않음
         * */
        NOT: {
          orderItems: {
            every: {
              options: {
                every: {
                  OR: [
                    { returnItems: { some: {} } },
                    { exchangeItems: { some: { NOT: { status: 'complete' } } } }, // 교환요청의 경우 재배송처리 완료시 해당 상품의 상태를 다시 출고완료로 변경함 -> 소비자 주문목록에 표시되어야 함
                    { orderCancellationItems: { some: {} } },
                  ],
                },
              },
            },
          },
        },
      };
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

    // 특정 날짜로 조회시
    if (searchDateType) {
      const dateFilter = {
        gte: periodStart ? new Date(periodStart) : undefined,
        lte: periodEnd ? new Date(periodEnd) : undefined,
      };
      // 주문일 기준으로 조회시
      if (searchDateType === '주문일') {
        where = { ...where, createDate: dateFilter };
      }

      // 입금일 기준으로 조회시
      if (searchDateType === '입금일') {
        where = { ...where, payment: { depositDate: dateFilter } };
      }
    }

    const OR = [];

    // 특정 주문상태로 조회시
    if (searchStatuses) {
      OR.push({
        orderItems: {
          some: {
            goods: sellerId ? { sellerId } : undefined,
            options: { some: { step: { in: dto.searchStatuses } } },
          },
        },
      });
    }

    // 교환, 반품, 환불 조회
    if (searchExtendedStatus) {
      let extendedStatus = {};
      searchExtendedStatus.forEach((s) => {
        extendedStatus[s] = { some: {} };
        OR.push(extendedStatus);
        extendedStatus = {};
      });
    }
    where = { ...where, OR: OR.length > 0 ? OR : undefined };

    // 검색어로 특정컬럼값 조회시
    if (search) {
      // search 텍스트 있는경우 특정컬럼에 search 텍스트가 포함되는지 확인
      const searchTextOrderColumn: Array<keyof Order> = [
        'orderCode',
        'recipientName',
        'recipientPhone',
        'recipientEmail',
        'ordererName',
        'ordererPhone',
        'ordererEmail',
      ];
      const searchTextList = search
        ? [
            { orderItems: { some: { goods: { goods_name: { contains: search } } } } },
            { payment: { depositor: { contains: search } } },
            ...searchTextOrderColumn.map((col) => ({ [col]: { contains: search } })),
          ]
        : undefined;
      where = { ...where, OR: searchTextList };
    }

    return where;
  }

  /** 특정 소비자의 주문목록 조회 - 선물주문인 경우 받는사람 정보 삭제 후처리 추가 */
  async getCustomerOrderList(dto: GetOrderListDto): Promise<OrderListRes> {
    const { orders, ...rest } = await this.getOrderList(dto);

    // 소비자 주문목록 후처리
    const postProcessed = orders.map((order) => {
      let _o = { ...order };
      //  선물하기 주문 && 소비자센터에서 요청한 경우 받는사람 정보 삭제
      if (_o.giftFlag && dto.appType === 'customer') {
        _o = this.removeRecipientInfo(_o);
      }
      return _o;
    });

    return {
      orders: postProcessed,
      ...rest,
    };
  }

  /** '15' 와 같은 stringNumber로 orderReceived와 같은  OrderProcessStep 값 리턴 */
  private getStepNameByStringNumber(
    stringNumber: OrderStatusNumString,
  ): OrderProcessStep {
    return getOrderProcessStepNameByStringNumber(stringNumber);
  }

  /** 주문에 포함된 상품옵션의 상태에 따라 표시될 주문의 상태 구하는 함수
   * - 판매자의 주문조회시 주문에 포함된 판매자의 상품옵션의 상태에 따라 표시될 주문의 상태 구하는 경우 사용
   * - 주문에 포함된 상품옵션 일부의 상태 변경 후 주문 상태 업데이트 시 사용
   * @deprecated by hwasurr 20220902.
   * Order.step 필드 제거 일감에서 자세한 내용 확인 (https://www.notion.so/whiletrue/db-api-Order-4020533acaaf4d3890d623d15ebdef3f)
   */
  public getOrderRealStep(
    originOrderStep: OrderProcessStep,
    sellerGoodsOrderItemOptions: { step: OrderItemOption['step'] }[],
  ): OrderProcessStep {
    // 주문상태가 partial000 인지 확인(부분000인지)
    const isPartialStep = [
      'partialExportReady',
      'partialExportDone',
      'partialShipping',
      'partialShippingDone',
    ].includes(originOrderStep);

    const originOrderStepNum = Number(orderProcessStepDict[originOrderStep]);

    // 원 주문 상태가 부분000 일때
    if (isPartialStep) {
      // 5를 더해 "부분" 상태를 제거한 상태
      const nonPartialStep = String(originOrderStepNum + 5) as OrderStatusNumString;
      // 옵션들 모두가 "부분" 상태를 제거한 상태만 있는 지 확인, 그렇다면 "부분" 상태를 제거한 상태를 반환
      if (
        sellerGoodsOrderItemOptions.every(
          (io) => orderProcessStepDict[io.step] === nonPartialStep,
        )
      ) {
        return this.getStepNameByStringNumber(nonPartialStep);
      }
    }

    // 옵션들 모두가 "부분" 상태보다 작은지 확인, 그렇다면 옵션들 중 가장 높은 상태를 반환
    if (
      sellerGoodsOrderItemOptions.every(
        (io) => Number(orderProcessStepDict[io.step]) < originOrderStepNum,
      )
    ) {
      const maxOptionStepStrNum = Math.max(
        ...sellerGoodsOrderItemOptions.map((io) => Number(orderProcessStepDict[io.step])),
      ).toString() as OrderStatusNumString;

      return this.getStepNameByStringNumber(maxOptionStepStrNum);
    }

    // 옵션들 중 원래 주문상태보다 하나라도 높은 상태가 있는 경우
    // 일부 판매자의 상품이 취소, 무효, 실패 상태인 경우, 주문 자체는 다른 판매자 상품의 상태 중 가장 높은 상태일 수 있다(판매자1의 주문상품은 모두 취소상태, 판매자2의 주문상품은 출고완료상태인 경우, 주문 자체의 상태는 출고완료로 저장되어 있음)
    if (
      sellerGoodsOrderItemOptions.some(
        (io) => Number(orderProcessStepDict[io.step]) > originOrderStepNum,
      )
    ) {
      // 판매자의 상품옵션이 모두 동일하며, 구매확정 | 결제취소 | 주문무효 | 결제실패 인경우 => 해당 상태 리턴
      const firstItemStep = sellerGoodsOrderItemOptions[0].step;
      if (
        sellerGoodsOrderItemOptions.every((io) => io.step === firstItemStep) &&
        orderEndSteps.includes(firstItemStep)
      ) {
        return firstItemStep;
      }
      // * 판매자의 상품옵션 상태가 다른 경우(예: 일부 결제취소, 일부 구매확정인 경우 => 이 경우 구매확정이 주문의 최종 상태여야함)
      // 일부 결제실패인 경우는 존재할 수 없다. (결제실패 - 지불수단 가상계좌 선택후 입금기한 내 미입금하여 취소처리된 경우)
      // 일부 주문무효인 경우는 현재는 존재하지 않음(주문무효 = 가상계좌 선택후 입금 전 소비자가 주문취소 하는 경우)
      const sellerOrderItemStepNumList = sellerGoodsOrderItemOptions.map((io) =>
        Number(orderProcessStepDict[io.step]),
      );
      // 판매자 상품옵션 중 가장 높은 상태 구하기
      const maxOptionStepNum = Math.max(...sellerOrderItemStepNumList);
      // 가장 높은 상태가 구매확정보다 낮은 단계인 경우
      // => 그대로 리턴
      if (maxOptionStepNum < 80) {
        return this.getStepNameByStringNumber(
          maxOptionStepNum.toString() as OrderStatusNumString,
        );
      }

      // 가장 높은 상태가 구매확정인 경우 => 구매확정 제외한 상태중 높은 단계 리턴(모든 상태가 구매확정인 경우 위의 firstItemStep 부분에서 리턴됨 )
      if (maxOptionStepNum === 80) {
        // 구매확정 제외한 상품이 존재하는지 확인
        const sellerOrderItemStepNumListExceptPurchaseConfirm =
          sellerOrderItemStepNumList.filter((stepNum) => stepNum !== 80);

        // 구매확정 제외한 상품이 존재하지 않으면 구매확정으로 상태 리턴
        if (!sellerOrderItemStepNumListExceptPurchaseConfirm.length) {
          return OrderProcessStep.purchaseConfirmed;
        }

        // 있으면 구매확정 제외한 상품 중 가장 높은 단계 리턴
        const maxStepNumExceptPurchaseConfirm = Math.max(
          ...sellerOrderItemStepNumListExceptPurchaseConfirm,
        );
        return this.getStepNameByStringNumber(
          maxStepNumExceptPurchaseConfirm.toString() as OrderStatusNumString,
        );
      }

      // 가장 높은 단계가 구매확정가장 높은 상태가 결제취소, 주문무효, 결제실패인 경우
      if (maxOptionStepNum >= 85) {
        // 결제취소85, 주문무효95, 결제실패99 상태 제외한 상품이 존재하는지 확인
        const sellerGoodsOrderItemOptionsExceptSkipSteps =
          sellerGoodsOrderItemOptions.filter((io) => !skipSteps.includes(io.step));

        // 결제취소85, 주문무효95, 결제실패99 상태 제외한 상품이 존재하지 않는 경우 => 모든 상품의 상태가 결제취소, 주문무효, 결제실패 중 하나이므로 이 중 가장 높은상태 리턴
        if (!sellerGoodsOrderItemOptionsExceptSkipSteps.length) {
          return this.getStepNameByStringNumber(
            maxOptionStepNum.toString() as OrderStatusNumString,
          );
        }

        // 결제취소85, 주문무효95, 결제실패99 상태 제외한 상품이 존재한다면
        const sellerOrderItemStepNumListExceptSkipSteps =
          sellerGoodsOrderItemOptionsExceptSkipSteps.map((io) =>
            Number(orderProcessStepDict[io.step]),
          );
        // 결제취소85, 주문무효95, 결제실패99 제외한 주문상품이 모두 구매확정인 경우 => 구매확정
        if (sellerOrderItemStepNumList.every((stepNum) => stepNum === 80)) {
          return OrderProcessStep.purchaseConfirmed;
        }
        // 모두 구매확정이 아닌 경우 => 구매확정 제외한 나머지 옵션 상태 중 가장 높은 상태 리턴
        const maxOptionStepNumExceptSkipStepsAndPurchaseConfirm = Math.max(
          ...sellerOrderItemStepNumListExceptSkipSteps.filter(
            (stepNum) => stepNum !== 80,
          ),
        );
        return this.getStepNameByStringNumber(
          maxOptionStepNumExceptSkipStepsAndPurchaseConfirm.toString() as OrderStatusNumString,
        );
      }
    }

    // 판매자의 상품옵션 상태가 주문 원상태보다 낮거나 높은 상태가 없다(주문상태와 동일하다)
    return originOrderStep;
  }

  /** 판매자 주문목록 후처리
    // 주문상품옵션 중 자기 상품옵션만 남기기
    // 자기상품옵션 상태에 기반한 주문상태 표시
  */
  private async postProcessSellerOrders(
    orders: OrderDataWithRelations[],
    sellerId: number, // 판매자 고유번호
  ): Promise<OrderDataWithRelations[]> {
    const sellerShippingGroupList = await this.prisma.shippingGroup.findMany({
      where: { sellerId },
    });
    return orders.map((o) => {
      const {
        orderItems,
        exchanges,
        returns,
        orderCancellations,
        shippings,
        exports,
        ...orderRestData
      } = o;

      // 주문상품옵션 중 판매자 본인의 상품옵션만 남기기
      const sellerGoodsOrderItems = orderItems.filter(
        (oi) => oi.goods.sellerId === sellerId,
      );
      // * 판매자 본인의 배송비정책과 연결된 주문배송비정보만 보내기
      let sellerShippings = shippings;

      if (sellerShippingGroupList.length > 0) {
        const shippingGroupIdList = sellerShippingGroupList.map((g) => g.id);
        sellerShippings = shippings.filter((s) =>
          shippingGroupIdList.includes(s.shippingGroupId),
        );
      }

      // * 판매자 상품이 포함된 교환/반품/취소/출고 데이터, 상품만 보내기
      // 해당 판매자의 상품인 주문상품id (OrderItem.id) 목록
      const sellerOrderItemsIdList = sellerGoodsOrderItems.map((item) => item.id);
      // 판매자의 상품이 포함된 교환(재배송)요청
      const sellerExchanges = exchanges
        .map((ex) => ({
          ...ex,
          // 교환요청 상품 중 판매자의 상품만 필터
          exchangeItems: ex.exchangeItems.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((ex) => ex.exchangeItems.length > 0); // 판매자 상품이 포함된 교환요청만 필터

      // 판매자 상품이 포함된 주문취소요청
      const sellerOrderCancellations = orderCancellations
        .map((oc) => ({
          ...oc,
          items: oc.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((oc) => oc.items.length > 0);

      // 판매자 상품이 포함된 반품요청
      const sellerReturns = returns
        .map((r) => ({
          ...r,
          items: r.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((r) => r.items.length > 0);

      // 판매자의 상품이 포함된 출고정보
      const sellerExports = exports
        .map((e) => ({
          ...e,
          items: e.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((e) => e.items.length > 0);

      return {
        ...orderRestData,
        orderItems: sellerGoodsOrderItems,
        exchanges: sellerExchanges,
        returns: sellerReturns,
        orderCancellations: sellerOrderCancellations,
        exports: sellerExports,
        shippings: sellerShippings,
      };
    });
  }

  /** 특정 판매자 주문목록 조회 - 주문상품 중 판매자의 상품만 추려냄 & 주문상태 표시는 판매자의 상품 상태에 따라 표시되는 후처리 추가  */
  async getSellerOrderList(dto: GetOrderListDto): Promise<OrderListRes> {
    if (!dto.sellerId)
      throw new BadRequestException('판매자 주문 목록 조회시 sellerId를 입력해야합니다');
    const { orders, ...rest } = await this.getOrderList(dto);

    // 주문상품옵션 중 자기 상품옵션만 남기기
    // 자기상품옵션 상태에 기반한 주문상태 표시
    const ordersWithOnlySellerGoodsOrderItems = await this.postProcessSellerOrders(
      orders,
      dto.sellerId,
    );

    return {
      orders: ordersWithOnlySellerGoodsOrderItems,
      ...rest,
    };
  }

  /** 전체 주문목록 조회 */
  async getOrderList(dto: GetOrderListDto): Promise<OrderListRes> {
    const { take, skip } = dto;
    const where = this.getOrderListFilterWhere(dto);
    const count = await this.prisma.order.count({ where });
    const orders = await this.prisma.order.findMany({
      where,
      take,
      skip,
      orderBy: [{ createDate: 'desc' }],
      include: {
        orderItems: {
          include: {
            options: true,
            support: {
              include: { broadcaster: { select: { userNickname: true, avatar: true } } },
            },
            review: true,
            goods: {
              select: {
                id: true,
                goods_name: true,
                image: true,
                sellerId: true,
                seller: {
                  select: {
                    sellerShop: {
                      select: {
                        shopName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        customerCouponLogs: {
          include: {
            customerCoupon: { include: { coupon: true } },
          },
        },
        mileageLogs: true,
        payment: true,
        refunds: true,
        exports: { include: { items: true } },
        exchanges: { include: { exchangeItems: true } },
        returns: { include: { items: true } },
        orderCancellations: { include: { items: true } },
        shippings: { include: { items: { include: { options: true } } } },
        sellerSettlementItems: {
          select: {
            liveShopping: {
              select: {
                broadcaster: {
                  select: {
                    userNickname: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const nextCursor = dto.skip + dto.take; // 다음 조회시 skip 값으로 사용
    return {
      orders,
      count,
      nextCursor: nextCursor >= count ? undefined : nextCursor,
    };
  }

  /** 주문 상세 조회 */
  async findOneOrderDetail(where: Prisma.OrderWhereInput): Promise<OrderDetailRes> {
    // 주문이 있는지 확인
    await this.findOneOrder(where);

    return this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            options: true,
            support: {
              include: { broadcaster: { select: { userNickname: true, avatar: true } } },
            },
            review: true,
            goods: {
              select: {
                id: true,
                goods_name: true,
                image: true,
                sellerId: true,
                seller: {
                  select: {
                    sellerShop: {
                      select: {
                        shopName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        customerCouponLogs: {
          include: {
            customerCoupon: { include: { coupon: true } },
          },
        },
        mileageLogs: true,
        payment: true,
        refunds: true,
        exports: { include: { items: true } },
        exchanges: { include: { exchangeItems: true, images: true } },
        returns: { include: { items: true, images: true } },
        orderCancellations: { include: { items: true } },
        shippings: { include: { items: { include: { options: true } } } },
      },
    });
  }

  /** 주문 1개 리턴, 없으면 400 에러 */
  async findOneOrder(where: Prisma.OrderWhereInput): Promise<Order> {
    const order = await this.prisma.order.findFirst({
      where,
    });
    if (!order) {
      let errorMessage = '해당 주문이 존재하지 않습니다. ';
      if (where.orderCode) errorMessage += `주문코드 : ${where.orderCode}`;
      if (where.id) errorMessage += `주문고유번호 : ${where.id}`;
      throw new BadRequestException(errorMessage);
    }

    return order;
  }

  /** 개별 주문 상세 조회 */
  async getOrderDetail(dto: GetOneOrderDetailDto): Promise<OrderDetailRes> {
    const { appType } = dto;

    const whereInput: Prisma.OrderWhereInput = dto.orderId
      ? { id: dto.orderId } // orderId 값이 있으면 orderId로 조회
      : { orderCode: dto.orderCode }; // 아니면 orderCode로 조회

    let result = await this.findOneOrderDetail({ ...whereInput, deleteFlag: false });

    // 특정 판매자가 개별주문 상세조회시
    // 주문상품 중 판매자의 상품만 보내기 & 판매자의 주문상품 상태에 따라 주문상태 표시 & 판매자의 베송비그룹으로 계산된 배송비만 보내기
    // && 교환/반품/취소 - 해당 판매자의 상품이 포함된 것만 보내기
    if (dto.sellerId) {
      const {
        orderItems,
        shippings,
        exchanges,
        orderCancellations,
        returns,
        exports,
        ...orderRestData
      } = result;

      // * 주문상품옵션 중 판매자 본인의 상품옵션만 남기기
      const sellerGoodsOrderItems = orderItems.filter(
        (oi) => oi.goods.sellerId === dto.sellerId,
      );

      // * 판매자 본인의 배송비정책과 연결된 주문배송비정보만 보내기
      let sellerShippings = shippings;
      const sellerShippingGroupList = await this.prisma.shippingGroup.findMany({
        where: { sellerId: dto.sellerId },
      });
      if (sellerShippingGroupList.length > 0) {
        const shippingGroupIdList = sellerShippingGroupList.map((g) => g.id);
        sellerShippings = shippings.filter((s) =>
          shippingGroupIdList.includes(s.shippingGroupId),
        );
      }

      // * 판매자 상품이 포함된 교환/반품/취소/출고 데이터, 상품만 보내기
      // 해당 판매자의 상품인 주문상품id (OrderItem.id) 목록
      const sellerOrderItemsIdList = sellerGoodsOrderItems.map((item) => item.id);
      // 판매자의 상품이 포함된 교환(재배송)요청
      const sellerExchanges = exchanges
        .map((ex) => ({
          ...ex,
          // 교환요청 상품 중 판매자의 상품만 필터
          exchangeItems: ex.exchangeItems.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((ex) => ex.exchangeItems.length > 0); // 판매자 상품이 포함된 교환요청만 필터

      // 판매자 상품이 포함된 주문취소요청
      const sellerOrderCancellations = orderCancellations
        .map((oc) => ({
          ...oc,
          items: oc.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((oc) => oc.items.length > 0);

      // 판매자 상품이 포함된 반품요청
      const sellerReturns = returns
        .map((r) => ({
          ...r,
          items: r.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((r) => r.items.length > 0);

      // 판매자의 상품이 포함된 출고정보
      const sellerExports = exports
        .map((e) => ({
          ...e,
          items: e.items.filter((item) =>
            sellerOrderItemsIdList.includes(item.orderItemId),
          ),
        }))
        .filter((e) => e.items.length > 0);

      result = {
        ...orderRestData,
        shippings: sellerShippings,
        orderItems: sellerGoodsOrderItems,
        exchanges: sellerExchanges,
        orderCancellations: sellerOrderCancellations,
        returns: sellerReturns,
        exports: sellerExports,
      };
    }

    /** 소비자센터에서 주문상세 조회 요청 && 선물주문인경우
     * => 받는사람 정보 삭제  & 출고데이터에서 택배사, 운송장번호 정보 삭제하고 보낸다
     */
    if (appType === 'customer' && result.giftFlag) {
      // 받는사람 정보 삭제
      result = this.removeRecipientInfo(result);
      // 출고데이터에서 택배사, 운송장번호 정보 삭제
      result = this.removeDeliveryCompanyAndDeliveryNumber(result);
    }

    if (result.payment && result.payment.method === 'virtualAccount') {
      if (!result.payment.account) return result;
      const encryptedComplexAccountText = result.payment.account; // `은행명_암호화된가상계좌` 형태로 저장되어 있음 PaymentService.createPayment 참고
      const [bankName, realEncryptedVirtualAccountText] =
        encryptedComplexAccountText.split('_'); // => _로 분리 [은행명, 암호화된 가상계좌번호]
      const decryptedVirtualAccount = this.cipherService.getDecryptedText(
        realEncryptedVirtualAccountText,
      );
      result = {
        ...result,
        payment: {
          ...result.payment,
          account: `${bankName} ${decryptedVirtualAccount}`,
        },
      };
    }

    return result;
  }

  /** 비회원 주문 상세 조회 */
  async getNonMemberOrderDetail({
    ordererPhone,
    ordererName,
  }: GetNonMemberOrderDetailDto): Promise<NonMemberOrderDetailRes> {
    let order = await this.findOneOrderDetail({
      ordererPhone,
      ordererName,
      customerId: null,
      deleteFlag: false,
      nonMemberOrderFlag: true,
    });

    if (order.giftFlag) {
      // 선물주문인경우 받는사람 정보 삭제
      order = this.removeRecipientInfo(order);
      // 출고정보에서 운송장번호, 택배회사 정보 삭제
      order = this.removeDeliveryCompanyAndDeliveryNumber(order);
    }

    return { order };
  }

  /** 주문수정 */
  async updateOrder(orderId: number, dto: UpdateOrderDto): Promise<boolean> {
    // 주문이 존재하는지 확인
    await this.findOneOrder({ id: orderId });

    const { customerId, sellerId, step, ...rest } = dto;

    let updateInput: Prisma.OrderUpdateInput = { ...rest };

    // 연결된 소비자 수정하는경우
    if (customerId) {
      updateInput = {
        ...updateInput,
        customer: { connect: { id: customerId } },
      };
    }

    // 주문 정보 업데이트
    await this.prisma.order.update({
      where: { id: orderId },
      data: updateInput,
    });

    // 주문 상태를 바꾸는 경우 -> 주문에 포함된 주문상품 옵션도 같이 변경한다
    if (step) {
      // 판매자가 주문상태를 변경하는 경우(주문에는 다른 판매자의 상품이 포함되어 있을수 있으므로, 자신의 상품상태만 변경해야함)
      if (sellerId) {
        await this.updateOrderItemOptionsStepBySeller({ orderId, sellerId, step });
        return true;
      }
      // 주문상태를 결제확인/결제취소/결제실패/주문무효로 바꾸는경우 (웹훅에서 처리 등)
      // => 해당 주문에 포함된 주문상품옵션의 상태도 일괄적으로 주문 상태와 동일하게 변경
      // (220713 기준 결제를 여러번 나눠서 할 수는 없으므로 결제확인시에도 일괄적으로 주문상품옵션 상태 변경함)
      await this.prisma.orderItemOption.updateMany({
        where: { orderItem: { orderId } },
        data: { step },
      });
      return true;
    }

    return true;
  }

  /** 주문 삭제(숨김처리) - 완료된 주문만 삭제 가능
   * 데이터 삭제x, deleteFlag를 true로 설정함) */
  async deleteOrder(orderId: number): Promise<boolean> {
    // 주문이 존재하는지 확인
    const order = await this.findOneOrderDetail({ id: orderId, deleteFlag: false });

    const orderItemOptionSteps = getOrderItemOptionSteps(order);
    // 완료된 주문이 아닌경우 403 에러
    if (!orderItemOptionSteps.every((step) => step === OrderProcessStep.shippingDone)) {
      throw new ForbiddenException(`완료된 주문만 삭제 가능합니다`);
    }
    await this.updateOrder(orderId, { deleteFlag: true });
    return true;
  }

  /** 구매확정 & 마일리지 적립 */
  async purchaseConfirm(dto: OrderPurchaseConfirmationDto): Promise<boolean> {
    const { orderItemOptionId, buyConfirmSubject } = dto;
    const orderItemOption = await this.prisma.orderItemOption.findUnique({
      where: { id: orderItemOptionId },
    });

    if (!orderItemOption) {
      throw new BadRequestException(
        `해당 주문상품옵션이 존재하지 않습니다. 주문상품옵션 고유번호 : ${orderItemOptionId}`,
      );
    }

    // * ---- 출고 Export 에 구매확정일자 저장(구매확정처리) ----
    // 주문상품옵션이 연결된 출고 조회
    const exportData = await this.prisma.export.findFirst({
      where: { items: { some: { orderItemOptionId } } },
      include: { items: { include: { orderItemOption: true } } },
    });
    // 해당 출고데이터에 구매확정일자 저장
    if (exportData && !exportData.buyConfirmDate) {
      await this.prisma.export.update({
        where: { id: exportData.id },
        data: {
          buyConfirmDate: new Date(),
          buyConfirmSubject,
          status: 'purchaseConfirmed',
        },
      });
    }

    // 해당 출고에 대한 구매확정처리 == 해당 출고에 포함된 주문상품옵션 중 구매확정이 가능한 상태의 상품들 구매확정처리
    const batchExportedItemsWithOrderOptionData = exportData
      ? exportData.items.filter(
          (i) => purchaseConfirmAbleSteps.includes(i.orderItemOption.step), // 구매확정 가능한 상태(shippingDone)인 주문상품만
        )
      : [];
    // 같이 구매확정 상태로 변경되어야 하는(동일한 출고에 포함된) 주문상품옵션id들
    const batchExportedOrderOptionIds = batchExportedItemsWithOrderOptionData.map(
      (i) => i.orderItemOptionId,
    );
    const buyConfirmTargetIds = batchExportedOrderOptionIds.concat(orderItemOptionId);
    // 해당 주문상품옵션 & 연결된 출고에 포함된 주문상품옵션을 구매확정으로 상태 변경
    await this.prisma.orderItemOption.updateMany({
      where: { id: { in: buyConfirmTargetIds } },
      data: { step: 'purchaseConfirmed' },
    });
    // 해당 주문상품에 연결된 출고상품
    await this.prisma.exportItem.updateMany({
      where: { id: { in: batchExportedItemsWithOrderOptionData.map((x) => x.id) } },
      data: { status: 'purchaseConfirmed' },
    });

    // * ---- 주문상품옵션 상태 변경 이후 주문상태 업데이트 ----
    // 해당 주문상품옵션이 포함된 주문 찾기
    const order = await this.prisma.order.findFirst({
      where: { orderItems: { some: { options: { some: { id: orderItemOptionId } } } } },
      select: {
        id: true,
        orderCode: true,
        customerId: true,
        orderItems: { select: { options: true } },
        shippings: { include: { items: { select: { id: true } } } }, // 주문배송비에 연겨된 주무상품id들(주문상품옵션이 아님)
      },
    });

    // * ---- 구매확정된 상품에 대한 마일리지 적립 ----
    if (order.customerId) {
      // 기본마일리지 설정값 => 전역 마일리지 설정값에 따라 적립률, 적립여부가 달라짐
      const defaultMileageSetting = await this.mileageSettingService.getMileageSetting();
      // 적립예정금액 초기화
      let earnMileage = 0;
      // 적립예정금액 구하기
      // 구매확정한 상품옵션 순회하며 (상품개당가격*주문한개수*마일리지적립률)로 적립예정금액 구한다
      const itemMileage = batchExportedItemsWithOrderOptionData.reduce((sum, opt) => {
        const itemPrice =
          Number(opt.orderItemOption.discountPrice) * opt.orderItemOption.quantity;
        return (
          sum + Math.floor(itemPrice * defaultMileageSetting.defaultMileagePercent * 0.01)
        );
      }, 0);
      // + 배송비에 대한 마일리지 적립(주문금액에 배송비가 포함되어 있으므로)
      // 구매확정된 출고상품이 연결된 주문배송비 정보 찾기
      const shippingMileage = order.shippings
        .filter((ship) => {
          const shippingRelatedOrderItemIds = ship.items.map((item) => item.id); // 해당 주문배송비에 연결된 주문상품id[]
          // 같이 출고된 주문상품 id[];
          const exportItemOrderIds = batchExportedItemsWithOrderOptionData.map(
            (ei) => ei.orderItemId,
          );
          return exportItemOrderIds.some((id) =>
            shippingRelatedOrderItemIds.includes(id),
          );
        })
        .reduce((sum, ship) => {
          return (
            sum +
            Math.floor(
              Number(ship.shippingCost) *
                defaultMileageSetting.defaultMileagePercent *
                0.01,
            )
          );
        }, 0);

      earnMileage = itemMileage + shippingMileage;
      // 마일리지 적립사유
      const reason = `주문번호 ${order.orderCode}에 대한 구매확정 (구매확정상품 : ${
        orderItemOption.goodsName
      } ${
        batchExportedItemsWithOrderOptionData.length > 1
          ? `외 ${batchExportedItemsWithOrderOptionData.length} 개`
          : ''
      }, 적립금액 : ${earnMileage}) `;

      const mileageUsedOnOrder = await this.prisma.customerMileageLog.findMany({
        where: {
          actionType: 'consume',
          orderId: order.id,
        },
      });

      // 적립예정 마일리지가 0원이상이고
      // 전역 마일리지설정에서 마일리지 기능이 사용중인경우 (useMileageFeature === true) 마일리지 적립함
      if (
        earnMileage > 0 &&
        defaultMileageSetting.useMileageFeature === true &&
        // (전역 마일리지설정에서 마일리지 적립방식이 onPaymentWithoutMileageUse이면서 주문시 마일리지 사용한 경우)는 제외
        !(
          defaultMileageSetting.mileageStrategy === 'onPaymentWithoutMileageUse' &&
          mileageUsedOnOrder.length > 0
        )
      ) {
        await this.mileageService.upsertMileage({
          customerId: order.customerId,
          actionType: MileageActionType.earn,
          orderId: order.id,
          mileage: earnMileage,
          reason,
        });
      }
    }

    return true;
  }

  /** 판매자센터 마이페이지 홈 오늘매출현황, 주문현황조회 */
  public async getOrderStats(sellerId: number): Promise<OrderStatsRes> {
    // * 판매자의 주문조회 1개월 내(판매자의 상품이 주문상품으로 포함된 주문)
    const sellerOrders = await this.prisma.order.findMany({
      where: {
        orderItems: { some: { goods: { sellerId } } },
        createDate: { gte: dayjs().subtract(1, 'month').toDate() },
      },
      include: {
        orderItems: { include: { options: true, goods: { select: { sellerId: true } } } },
        shippings: { include: { shippingGroup: { select: { sellerId: true } } } },
      },
    });
    // 주문상품 중 판매자의 상품&상품옵션만 추려내기 && 주문배송비 중 판매자의 주문배송비만 추려내기
    const ordersWithFilteredItems = sellerOrders.map((order) => {
      const { orderItems, shippings, ...orderData } = order;

      const sellerGoodsOrderItems = orderItems.filter((oi) => {
        return oi.goods.sellerId === sellerId;
      });
      const sellerOrderShippings = shippings.filter((s) => {
        return s.shippingGroup.sellerId === sellerId;
      });
      return {
        ...orderData,
        orderItems: sellerGoodsOrderItems,
        shippings: sellerOrderShippings,
      };
    });

    // 주문상태별 개수 카운트
    const orderStats = {
      shippingReady: 0, // 상품준비 + 부분출고준비 + 출고준비 + 부분출고완료 + 출고완료
      shipping: 0, // 부분배송중 + 배송중 + 부분배송완료
      shippingDone: 0, //  배송완료
    };
    ordersWithFilteredItems.forEach((order) => {
      const orderItemOptionSteps = getOrderItemOptionSteps(order);
      if (sellerOrderSteps.shippingReady.some((x) => orderItemOptionSteps.includes(x))) {
        orderStats.shippingReady += 1;
      }
      if (sellerOrderSteps.shipping.some((x) => orderItemOptionSteps.includes(x))) {
        orderStats.shipping += 1;
      }
      if (sellerOrderSteps.shippingDone.some((x) => orderItemOptionSteps.includes(x))) {
        orderStats.shippingDone += 1;
      }
    });

    // * 판매자의 오늘매출현황 -> 1달치 조회했던 주문데이터 활용
    // 1달치 조회한 주문 중 오늘 생성된 주문 && 주문상태가 결제확인 단계 이상인 주문 필터링
    const sellerOrdersToday = ordersWithFilteredItems.filter((order) => {
      const orderItemOptionSteps = getOrderItemOptionSteps(order);
      return (
        dayjs(order.createDate).isToday() &&
        !(
          [
            'orderReceived',
            'paymentCanceled',
            'orderInvalidated',
            'paymentFailed',
          ] as OrderProcessStep[]
        ).some((x) => orderItemOptionSteps.includes(x))
      );
    });

    // 추려낸 주문상품의 배송비 + 주문상품옵션가격
    let tempTotalSalesToday = 0;
    sellerOrdersToday.forEach((order) => {
      // 주문배송비
      tempTotalSalesToday += order.shippings
        .map((s) => Number(s.shippingCost))
        .reduce((sum, cur) => sum + cur, 0);
      // 주문상품옵션가격
      tempTotalSalesToday += order.orderItems
        .flatMap((i) => i.options)
        .map((opt) => Number(opt.discountPrice) * Number(opt.quantity))
        .reduce((sum, cur) => sum + cur, 0);
    });

    // * 판매자의 오늘환불현황
    // 환불상품에 판매자 상품이 포함된 환불조회
    const sellerRefunds = await this.prisma.refund.findMany({
      where: {
        items: { some: { orderItem: { goods: { sellerId } } } },
        completeDate: { gte: new Date(dayjs().format('YYYY-MM-DD')) },
      },
      include: {
        items: {
          include: {
            orderItem: {
              select: { goods: { select: { sellerId: true } } },
            },
            orderItemOption: true,
          },
        },
      },
    });
    // 환불 상품에서 판매자 상품만 추려냄
    const sellerItemOnlyRefundItems = sellerRefunds
      .flatMap((refund) => refund.items)
      .filter((item) => item.orderItem.goods.sellerId === sellerId);
    // 환불된 판매자의 상품 가격 총합
    const todayRefundAmountTotal = sellerItemOnlyRefundItems.reduce((total, item) => {
      return total + Number(item.orderItemOption.discountPrice);
    }, 0);

    return {
      orders: {
        배송완료: orderStats.shippingDone,
        배송준비중: orderStats.shippingReady,
        배송중: orderStats.shipping,
      },
      sales: {
        주문: { count: sellerOrdersToday.length, sum: tempTotalSalesToday },
        환불: { count: sellerRefunds.length, sum: todayRefundAmountTotal },
      },
    };
  }

  /** 방송인 후원 주문 목록 조회  */
  public async findAllByBroadcaster(
    broadcasterId: number,
    dto: FindManyDto,
  ): Promise<FindAllOrderByBroadcasterRes> {
    const minTake = 5;
    const realTake = Math.min(minTake, dto.take ? Number(dto.take) : undefined) + 1;
    const orders = await this.prisma.order.findMany({
      skip: dto.skip ? Number(dto.skip) : undefined,
      take: realTake || undefined,
      where: {
        deleteFlag: false,
        orderItems: { some: { support: { broadcasterId } } },
      },
      orderBy: { createDate: 'desc' },
      select: {
        orderCode: true,
        orderPrice: true,
        paymentPrice: true,
        giftFlag: true,
        supportOrderIncludeFlag: true,
        createDate: true,
        orderItems: {
          select: {
            id: true,
            channel: true,
            review: true,
            support: true,
            options: true,
            goods: {
              select: {
                goods_name: true,
                image: true,
                seller: { select: { sellerShop: { select: { shopName: true } } } },
              },
            },
          },
        },
      },
    });
    // 주문에 포함된 상품 중 방송인에게 후원한 상품만 추리기
    const _result = orders.map((x) => ({
      ...x,
      orderItems: x.orderItems.filter((i) => i.support.broadcasterId === broadcasterId),
    }));
    const nextCursor = (dto.skip || 0) + (dto.take || minTake); // 다음 조회시 skip 값으로 사용

    if (_result.length === realTake) {
      return {
        orders: _result.slice(0, dto.take || minTake),
        nextCursor,
      };
    }
    return { nextCursor: undefined, orders: _result };
  }

  /** 배송비 조회
   *
   * 리턴형태
   * {
   *  배송비그룹id : { isShippingAvailable: boolean, items: goodsId[], cost: {std:number, add:number} | null },
   *  배송비그룹id : { isShippingAvailable: boolean, items: goodsId[], cost: {std:number, add:number} | null },
   *  ...
   * }
   */
  async checkOrderShippingCost(
    dto: OrderShippingCheckDto,
  ): Promise<ShippingCostByShippingGroupId> {
    // * 선물주문이 아닌경우 dto로 들어온 주소
    let address = dto.address || '';
    let postalCode = dto.postalCode || '';
    // * 선물주문인경우 방송인의 주소
    if (dto.isGiftOrder && dto.broadcasterId) {
      const broadcasterAddress = await this.prisma.broadcasterAddress.findUnique({
        where: { broadcasterId: dto.broadcasterId },
      });
      address = broadcasterAddress.address;
      postalCode = broadcasterAddress.postalCode;
    }

    // 쿼리스트링으로 넘어오는 items값 validation 오류(type transform 적용 안되서 string으로 들어옴) 해결 못해서 여기서 객체로 바꿈
    const items: ShippingCheckItem[] = dto.items?.map((list) =>
      JSON.parse(list.toString()),
    );

    // * 주문상품의 배송비 그룹 정보(배송정책,배송옵션,배송지역별가격)
    const goodsIdList = [...new Set(items.map((i) => i.goodsId))];
    const shippingGroups = await this.prisma.shippingGroup.findMany({
      where: { goods: { some: { id: { in: goodsIdList } } } },
      include: {
        shippingSets: {
          include: { shippingOptions: { include: { shippingCost: true } } },
        },
      },
    });

    // * 주문상품옵션의 가격(가격정보는 프론트에서 보내지 않았음)
    const optionIdList = [...new Set(items.map((i) => i.goodsOptionId))];
    const options = await this.prisma.goodsOptions.findMany({
      where: { id: { in: optionIdList } },
      include: { goods: { select: { shippingGroupId: true } } },
    });
    const goodsOptionsWithQuanntity: (ShippingCheckItem &
      GoodsOptions & { goods: { shippingGroupId: Goods['shippingGroupId'] } })[] =
      options.map((opt) => {
        const _item = items.find((i) => i.goodsOptionId === opt.id);
        return { ...opt, ..._item };
      });

    // * {배송그룹id : 상품옵션정보[]}
    const shippingGroupIdList = shippingGroups.map((sg) => sg.id);
    const goodsOptionsByShippingGroupId = shippingGroupIdList.reduce(
      (obj, shippingGroupId) => {
        const includedGoodsOptions = goodsOptionsWithQuanntity.filter(
          (opt) => opt.goods.shippingGroupId === shippingGroupId,
        );
        return {
          ...obj,
          [shippingGroupId]: includedGoodsOptions,
        };
      },
      {} as Record<
        number,
        (ShippingCheckItem &
          GoodsOptions & { goods: { shippingGroupId: Goods['shippingGroupId'] } })[]
      >,
    );

    const tempResult = shippingGroups.reduce((result, cur) => {
      const curShippingGroupData = cur;
      const goodsOptions = goodsOptionsByShippingGroupId[cur.id];
      const withShippingCalculTypeFree = shippingGroups
        .filter((g) => g.id !== cur.id && g.sellerId === cur.sellerId)
        .some((g) => g.shipping_calcul_type === 'free');
      const { cost, isShippingAvailable } = calculateShippingCost({
        postalCode,
        address,
        shippingGroupData: curShippingGroupData,
        goodsOptions,
        withShippingCalculTypeFree,
      });
      return {
        ...result,
        [cur.id]: {
          cost,
          isShippingAvailable,
          items: [...new Set(goodsOptions.map((o) => o.goodsId))], // 해당배송비에 묶인 상품 goodsId
        },
      };
    }, {} as ShippingCostByShippingGroupId);

    return tempResult;
  }

  /** 주문에 포함된 상품 중 "특정 판매자 상품"의 상태 변경 => 주문상품옵션 상태에 따라 주문상태 업데이트 */
  public async updateOrderItemOptionsStepBySeller({
    orderId,
    sellerId,
    step,
  }: {
    orderId: number;
    sellerId: number;
    step: OrderProcessStep;
  }): Promise<boolean> {
    // 판매자 상품인 주문상품옵션의 상태 업데이트
    await this.prisma.orderItemOption.updateMany({
      where: { orderItem: { orderId, goods: { sellerId } } },
      data: { step },
    });

    return true;
  }
}
