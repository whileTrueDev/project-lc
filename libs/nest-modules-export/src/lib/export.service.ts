import { Injectable } from '@nestjs/common';
import { Export, Order, OrderProcessStep } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateKkshowExportDto,
  ExportCreateRes,
  ExportListRes,
  ExportManyDto,
  ExportRes,
} from '@project-lc/shared-types';
import dayjs = require('dayjs');
import { nanoid } from 'nanoid';

type ExportCodeType = 'normal' | 'bundle'; // 일반출고코드 | 합포장출고코드
const exportCodePrefix: Record<ExportCodeType, string> = {
  normal: 'D', // 일반출고코드 접두사 (Export.exportCode 에 사용되는 출고코드)
  bundle: 'B', // 합포장 코드 접두사 (Export.bundleExportCode 에 사용되는 합포장코드)
};
@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  /** 출고코드 생성 */
  private generateExportCode({ type = 'normal' }: { type: ExportCodeType }): string {
    const prefix = exportCodePrefix[type];
    return prefix + dayjs().format('YYYYMMDDHHmmssSSS') + nanoid(6);
  }

  /** 실물 출고처리 (Export 테이블에 데이터 생성) */
  async createExportRecord(
    dto: CreateKkshowExportDto,
    exportCode: string,
  ): Promise<Export> {
    return this.prisma.export.create({
      data: {
        order: { connect: { id: dto.orderId } },
        seller: dto.sellerId ? { connect: { id: dto.sellerId } } : undefined,
        exportCode,
        deliveryCompany: dto.deliveryCompany,
        deliveryNumber: dto.deliveryNumber,
        exportDate: new Date(),
        items: {
          create: dto.items.map((item) => ({
            orderItem: { connect: { id: item.orderItemId } },
            orderItemOption: { connect: { id: item.orderItemOptionId } },
            amount: item.amount,
          })),
        },
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
        const { amount: exportAmount, orderItemOptionId } = item;
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
  async updateOrderItemOptionsStatus(dto: CreateKkshowExportDto): Promise<boolean> {
    // 주문상품옵션
    const orderItemOptions = await this.prisma.orderItemOption.findMany({
      where: { id: { in: dto.items.map((item) => item.orderItemOptionId) } },
      select: { id: true, quantity: true, exportItems: true },
    });
    // 주문상품옵션.quantity 가 총합(주문상품옵션.출고상품옵션.amount)보다 작으면 부분출고
    // 같으면 전체출고로 주문상품옵션의 상태 업데이트
    const updateDataList = await Promise.all(
      orderItemOptions.map(async (orderItemOption) => {
        const { quantity: originOrderAmount, exportItems, id } = orderItemOption; // 주문상품옵션 원래 주문개수
        const totalExportedAmount = exportItems.reduce((sum, cur) => sum + cur.amount, 0); // 주문상품옵션에 연결된 출고상품의 출고개수 합
        const newOrderItemOptionStepAfterExport: OrderProcessStep =
          originOrderAmount === totalExportedAmount ? 'exportDone' : 'partialExportDone';
        return { id, step: newOrderItemOptionStepAfterExport };
      }),
    );
    await this.prisma.$transaction(
      updateDataList.map(({ id, step }) => {
        return this.prisma.orderItemOption.update({
          where: { id },
          data: { step },
        });
      }),
    );
    return true;
  }

  /** 연결된 주문 상태변경 */
  async updateOrderStatus(dto: CreateKkshowExportDto): Promise<Order> {
    // 주문과 연결된 주문상품옵션의 상태가 모두 출고완료이면 주문도 출고완료
    // 아니면 부분출고로 업데이트
    const orderItemOptions = await this.prisma.orderItemOption.findMany({
      where: { orderItem: { order: { id: dto.orderId } } },
    });

    const isOrderItemAllExportDone = orderItemOptions.every(
      (oi) => oi.step === 'exportDone',
    );

    return this.prisma.order.update({
      where: { id: dto.orderId },
      data: { step: isOrderItemAllExportDone ? 'exportDone' : 'partialExportDone' },
    });
  }

  /** 단일 출고처리 */
  public async exportOne(dto: CreateKkshowExportDto): Promise<ExportCreateRes> {
    const exportCode = this.generateExportCode({ type: 'normal' });

    /** 출고처리 (Export, ExportItem 테이블에 데이터 생성) */
    await this.createExportRecord(dto, exportCode);
    /** 재고차감 */
    await this.updateGoodsSupplies(dto);
    /** 주문상품옵션의 상태변경 -> 주문상태변경보다 먼저 진행 */
    await this.updateOrderItemOptionsStatus(dto);
    /** 주문의 상태변경 -> 주문상품옵션 상태변경 후 진행 */
    const order = await this.updateOrderStatus(dto);

    return { orderId: order.id, orderCode: order.orderCode, exportCode };
  }

  /** 일괄 출고처리 */
  public async exportMany(dto: ExportManyDto): Promise<boolean> {
    const res = await Promise.all(
      dto.exportOrders.map((exportOrder) => this.exportOne(exportOrder)),
    );

    return res.every(({ exportCode }) => !!exportCode);
  }

  /** 합포장 출고처리 */
  public async exportBundle(): Promise<boolean> {
    console.log('합포장 출고처리');
    return true;
  }

  /** 개별출고정보 조회 */
  public async getExportDetail(exportCode: string): Promise<ExportRes> {
    console.log(`개별출고정보 조회 exportCode:${exportCode}`);
    return {} as ExportRes;
  }

  /** 출고목록조회 - 판매자, 관리자 용 */
  public async getExportList(): Promise<ExportListRes> {
    console.log('출고목록조회 - 판매자, 관리자 용');
    return [];
  }
}
