import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';
import { CreateReturnDto, CreateReturnRes } from '@project-lc/shared-types';
import { nanoid } from 'nanoid';

@Injectable()
export class ReturnService extends ServiceBaseWithCache {
  #RETURN_CACHE_KEY = 'return';
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

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
  /** 특정 반품요청 상세 조회 */
  /** 반품요청 상태 변경 */
  /** 반품요청 삭제 */
}
