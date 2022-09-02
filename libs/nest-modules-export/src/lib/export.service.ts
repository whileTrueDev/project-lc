import { BadRequestException, Injectable } from '@nestjs/common';
import { Export, OrderProcessStep, Prisma } from '@prisma/client';
import { OrderService } from '@project-lc/nest-modules-order';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateKkshowExportDto,
  ExportCreateRes,
  ExportItemOption,
  ExportListRes,
  ExportManyDto,
  ExportRes,
  findExportItemData,
  FindExportListDto,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';
import dayjs = require('dayjs');

type ExportCodeType = 'normal' | 'bundle'; // 일반출고코드 | 합포장출고코드
const exportCodePrefix: Record<ExportCodeType, string> = {
  normal: 'D', // 일반출고코드 접두사 (Export.exportCode 에 사용되는 출고코드)
  bundle: 'B', // 합포장 코드 접두사 (Export.bundleExportCode 에 사용되는 합포장코드)
};
@Injectable()
export class ExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
  ) {}

  /** 출고코드 생성 */
  private generateExportCode({ type = 'normal' }: { type: ExportCodeType }): string {
    const prefix = exportCodePrefix[type];
    return prefix + dayjs().format('YYYYMMDDHHmm') + nanoid(6);
  }

  /** 실물 출고처리 (Export 테이블에 데이터 생성) */
  async createExportRecord({
    dto,
    exportCode,
    bundleExportCode,
  }: {
    dto: CreateKkshowExportDto;
    exportCode: string;
    bundleExportCode?: string;
  }): Promise<Export> {
    return this.prisma.export.create({
      data: {
        order: { connect: { id: dto.orderId } },
        seller: dto.sellerId ? { connect: { id: dto.sellerId } } : undefined, // 출고시 출고 진행한 판매자의 고유번호로 연결한다
        exportCode,
        bundleExportCode,
        deliveryCompany: dto.deliveryCompany,
        deliveryNumber: dto.deliveryNumber,
        exportDate: new Date(),
        items: {
          create: dto.items.map((item) => ({
            orderItem: { connect: { id: item.orderItemId } },
            orderItemOption: { connect: { id: item.orderItemOptionId } },
            quantity: item.quantity,
          })),
        },
        exchangeExportedFlag: Boolean(dto.exchangeExportedFlag),
        exchange: dto.exchangeId ? { connect: { id: dto.exchangeId } } : undefined, //  재출고인경우(재배송요청에 대한 출고) 재배송요청과 출고데이터 연결
      },
    });
  }

  /** 재고차감 */
  async updateGoodsSupplies(dto: CreateKkshowExportDto): Promise<boolean> {
    const { items } = dto;

    // orderItemOption에 연결된 상품재고정보 찾기
    // { 상품재고 id, 출고상품개수 } 배열을 만듦
    const goodsSupplyDataList = await Promise.all(
      items.map(async (item) => {
        const { quantity: exportAmount, orderItemOptionId } = item;
        const orderItemOptionWithgoodsSupply =
          await this.prisma.orderItemOption.findUnique({
            where: { id: orderItemOptionId },
            select: { goodsOption: { select: { supply: { select: { id: true } } } } },
          });
        const goodsSupplyId = orderItemOptionWithgoodsSupply.goodsOption.supply.id;
        return { goodsSupplyId, exportAmount };
      }),
    );

    // 재고차감실행
    await this.prisma.$transaction(
      goodsSupplyDataList.map(({ goodsSupplyId, exportAmount }) => {
        return this.prisma.$executeRaw`
          UPDATE GoodsOptionsSupplies SET
          stock = stock - IF(stock >= ${exportAmount}, ${exportAmount}, stock)
          WHERE id = ${goodsSupplyId}
        `;
      }),
    );

    return true;
  }

  /** 연결된 주문상품옵션 상태변경 */
  async updateOrderItemOptionsStatus(
    exportItems: CreateKkshowExportDto['items'],
  ): Promise<boolean> {
    // 주문상품옵션
    const orderItemOptions = await this.prisma.orderItemOption.findMany({
      where: { id: { in: exportItems.map((item) => item.orderItemOptionId) } },
      select: { id: true, quantity: true, exportItems: true },
    });
    // 주문상품옵션.quantity 가 총합(주문상품옵션.출고상품옵션.quantity)보다 작으면 부분출고
    // 아니면 전체출고로 주문상품옵션의 상태 업데이트
    const updateDataList = await Promise.all(
      orderItemOptions.map(async (orderItemOption) => {
        const {
          quantity: originOrderAmount,
          exportItems: _expItems,
          id,
        } = orderItemOption; // 주문상품옵션 원래 주문개수
        const totalExportedAmount = _expItems.reduce((sum, cur) => sum + cur.quantity, 0); // 주문상품옵션에 연결된 출고상품의 출고개수 합
        const newOrderItemOptionStepAfterExport: OrderProcessStep =
          originOrderAmount <= totalExportedAmount ? 'exportDone' : 'partialExportDone';
        return { id, step: newOrderItemOptionStepAfterExport };
      }),
    );
    await this.prisma.$transaction(
      updateDataList.map(({ id, step }) => {
        return this.prisma.orderItemOption.update({ where: { id }, data: { step } });
      }),
    );
    return true;
  }

  /** 단일 출고처리 */
  public async exportOne({
    dto,
    bundleExportCode,
  }: {
    dto: CreateKkshowExportDto;
    bundleExportCode?: string;
  }): Promise<ExportCreateRes> {
    const exportCode = this.generateExportCode({ type: 'normal' });

    /** 출고처리 (Export, ExportItem 테이블에 데이터 생성) */
    const exportRecord = await this.createExportRecord({
      dto,
      exportCode,
      bundleExportCode,
    });
    /** 재고차감 */
    await this.updateGoodsSupplies(dto);
    /** 주문상품옵션의 상태변경 -> 주문상태변경보다 먼저 진행 */
    await this.updateOrderItemOptionsStatus(dto.items);
    const order = await this.orderService.findOneOrder({ id: dto.orderId });
    return { orderId: order.id, orderCode: order.orderCode, exportCode };
  }

  /** 일괄 출고처리 */
  public async exportMany(dto: ExportManyDto): Promise<boolean> {
    const res = await Promise.all(
      dto.exportOrders.map((exportOrder) => this.exportOne({ dto: exportOrder })),
    );

    return res.every(({ exportCode }) => !!exportCode);
  }

  /** 합포장 출고처리 -> 일괄출고처리와 비슷하나 출고에 합포장코드가 추가되고, 연결된 주문에 합포장플래그 true 설정 */
  public async exportBundle(dto: ExportManyDto): Promise<boolean> {
    const bundleExportCode = this.generateExportCode({ type: 'bundle' });

    // 일괄출고생성 && 출고생성시 합포장코드 저장
    const exports = await Promise.all(
      dto.exportOrders.map((exportOrder) =>
        this.exportOne({ dto: exportOrder, bundleExportCode }),
      ),
    );
    // 출고가 연결될 주문 orderId 찾기
    const orderIdList: number[] = [];
    exports.forEach((e) => {
      const { orderId } = e;
      if (!orderIdList.includes(orderId)) orderIdList.push(orderId);
    });

    // 해당 주문 합포장플래그 수정
    await this.prisma.order.updateMany({
      where: { id: { in: orderIdList } },
      data: { bundleFlag: true },
    });

    return true;
  }

  /** 개별출고정보 조회 */
  public async getExportDetail(exportCode: string): Promise<ExportRes> {
    const exportData = await this.prisma.export.findUnique({
      where: { exportCode },
      include: {
        order: true,
        items: {
          include: {
            orderItem: {
              select: { goods: { select: { goods_name: true, image: true, id: true } } },
            },
            orderItemOption: { select: { name: true, value: true, discountPrice: true } },
          },
        },
      },
    });

    if (!exportData) {
      throw new BadRequestException(
        `해당 출고정보가 존재하지 않습니다. 출고코드 : ${exportCode}`,
      );
    }

    let bundleExports = [];
    if (exportData.bundleExportCode) {
      const bundleData = await this.prisma.export.findMany({
        where: { bundleExportCode: exportData.bundleExportCode },
      });
      bundleExports = bundleData;
    }

    const { items, ...rest } = exportData;

    return {
      ...rest,
      items: this.exportItemsToResDataType(items),
      bundleExports,
    };
  }

  /** getExportDetail에서 조회한 items 데이터를 리턴타입에 맞게 바꾸는 함수  */
  private exportItemsToResDataType(items: findExportItemData[]): ExportItemOption[] {
    return items.map((item) => {
      const { orderItem, orderItemOption, ...rest } = item;

      return {
        ...rest,
        goodsId: orderItem.goods.id,
        goodsName: orderItem.goods.goods_name,
        image: orderItem.goods.image[0]?.image,
        price: orderItemOption.discountPrice.toString(), // numberstring 으로 보낸다
        title1: orderItemOption.name,
        option1: orderItemOption.value,
      };
    });
  }

  /** 출고목록조회 - 판매자, 관리자 용
   * @param dto.sellerId 값이 있으면, 해당 판매자의 상품이 포함된 출고정보만 조회
   */
  public async getExportList(dto: FindExportListDto): Promise<ExportListRes> {
    const { sellerId, orderCode, skip, take, withSellerInfo } = dto;

    const where: Prisma.ExportWhereInput = {
      order: { orderCode },
      items: sellerId ? { some: { orderItem: { goods: { sellerId } } } } : undefined,
    };
    const totalCount = await this.prisma.export.count({ where });
    const data = await this.prisma.export.findMany({
      where,
      skip,
      take: take + 1,
      orderBy: { exportDate: 'desc' },
      include: {
        order: true,
        items: {
          include: {
            orderItem: {
              select: { goods: { select: { goods_name: true, image: true, id: true } } },
            },
            orderItemOption: { select: { name: true, value: true, discountPrice: true } },
          },
        },
        seller: withSellerInfo ? { include: { sellerShop: true } } : undefined,
      },
    });

    // 리턴타입에 맞게 주문상품 형태 변경
    const list = data.map((d) => {
      const { items, ...rest } = d;
      return { ...rest, items: this.exportItemsToResDataType(items) };
    });
    return {
      edges: list,
      totalCount,
      nextCursor: list.length > take ? skip + take : undefined,
      hasNextPage: list.length > take,
    };
  }
}
