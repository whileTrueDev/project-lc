import { Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterSettlements, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

interface CreateBroadcasterSettlementHistoryDto {
  round: BroadcasterSettlements['round'];
  totalAmount: BroadcasterSettlements['totalAmount'];
  totalCommission: BroadcasterSettlements['totalCommission'];
}

type CreateBroadcasterSettlementHistoriesDto = {
  histories: CreateBroadcasterSettlementHistoryDto[];
};

@Injectable()
export class BroadcasterSettlementHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  // 정산 내역 생성
  public async executeSettle(
    broadcasterId: Broadcaster['id'],
    dto: CreateBroadcasterSettlementHistoryDto,
  ): Promise<BroadcasterSettlements> {
    return this.prisma.broadcasterSettlements.create({
      data: { broadcaster: { connect: { id: broadcasterId } }, ...dto },
    });
  }

  // 정산 내역 일괄 생성
  public async executeSettleMany(
    broadcasterId: Broadcaster['id'],
    dto: CreateBroadcasterSettlementHistoriesDto,
  ): Promise<number> {
    const data: Prisma.Enumerable<Prisma.BroadcasterSettlementsCreateManyInput> =
      dto.histories.map((hi) => ({ ...hi, broadcasterId }));

    const result = await this.prisma.broadcasterSettlements.createMany({
      data,
    });
    return result.count;
  }

  public async findHistories(): Promise<any> {
    // 정산 내역 조회
  }
}
