import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Return } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateReturnDto,
  CreateReturnRes,
  DeleteReturnRes,
  GetReturnListDto,
  ReturnDetailRes,
  ReturnListRes,
  UpdateReturnDto,
  UpdateReturnRes,
} from '@project-lc/shared-types';
import { nanoid } from 'nanoid';

@Injectable()
export class ReturnService {
  constructor(private readonly prisma: PrismaService) {}

  /** 반품코드 생성 */
  private createReturnCode(): string {
    return nanoid();
  }

  /** 반품요청 생성 */
  async createReturn(dto: CreateReturnDto): Promise<CreateReturnRes> {
    const { orderId, items, images, ...rest } = dto;
    const data = await this.prisma.return.create({
      data: {
        ...rest,
        returnCode: this.createReturnCode(),
        order: { connect: { id: orderId } },
        items: {
          create: items.map((item) => ({
            orderItem: { connect: { id: item.orderItemId } },
            orderItemOption: { connect: { id: item.orderItemOptionId } },
            amount: item.amount,
          })),
        },
        images: {
          create: images,
        },
      },
    });

    return data;
  }

  /** 반품요청 내역 조회 */
  async getReturnList(dto: GetReturnListDto): Promise<ReturnListRes> {
    let where: Prisma.ReturnWhereInput;
    if (dto.customerId) {
      where = {
        order: { customerId: dto.customerId },
      };
    }
    if (dto.sellerId) {
      where = {
        items: { some: { orderItem: { goods: { sellerId: dto.sellerId } } } },
      };
    }
    const data = await this.prisma.return.findMany({
      take: dto.take,
      skip: dto.skip,
      where,
      include: {
        items: true,
        images: true,
      },
    });
    return data;
  }

  async findUnique(where: Prisma.ReturnWhereUniqueInput): Promise<Return> {
    const data = await this.prisma.return.findUnique({
      where,
    });

    if (!data)
      throw new BadRequestException(
        `해당 반품요청 정보가 없습니다. ${JSON.stringify(where)}`,
      );
    return data;
  }

  /** 특정 반품요청 상세 조회 */
  async getReturnDetail(id: number): Promise<ReturnDetailRes> {
    await this.findUnique({ id });

    return this.prisma.return.findUnique({
      where: { id },
      include: {
        order: { select: { orderCode: true, id: true } },
        items: true,
        images: true,
        refund: true,
      },
    });
  }

  /** 반품요청 상태 변경(판매자 혹은 관리자가 진행) */
  async updateReturnStatus(id: number, dto: UpdateReturnDto): Promise<UpdateReturnRes> {
    await this.findUnique({ id });

    const { refundId, ...rest } = dto;
    await this.prisma.return.update({
      where: { id },
      data: {
        ...rest,
        completeDate: dto.status && dto.status === 'complete' ? new Date() : undefined,
        refund: refundId ? { connect: { id: refundId } } : undefined,
      },
    });

    return true;
  }

  /** 반품요청 삭제 */
  async deleteReturn(id: number): Promise<DeleteReturnRes> {
    const data = await this.findUnique({ id });
    if (data.status !== 'requested') {
      throw new BadRequestException(`처리되기 이전에만 삭제가 가능합니다`);
    }

    await this.prisma.return.delete({ where: { id } });
    return true;
  }
}
