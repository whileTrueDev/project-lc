import { Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterSettlements } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateBroadcasterSettlementHistoryDto } from '@project-lc/shared-types';

@Injectable()
export class BroadcasterSettlementHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 정산 내역 생성
  public async executeSettle(
    broadcasterId: Broadcaster['id'],
    dto: CreateBroadcasterSettlementHistoryDto,
  ): Promise<BroadcasterSettlements> {
    const { round, totalAmount, totalCommission } = dto;
    return this.prisma.broadcasterSettlements.create({
      data: {
        broadcaster: { connect: { id: broadcasterId } },
        round,
        totalAmount,
        totalCommission,
        broadcasterSettlementOrders: {
          createMany: { data: dto.items },
        },
      },
    });
  }

  public async findHistories(): Promise<any> {
    // 정산 내역 조회
  }
}
