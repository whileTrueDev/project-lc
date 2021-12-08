import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { BroadcasterSettlementInfoDto } from '@project-lc/shared-types';
import { BroadcasterSettlementInfo } from '.prisma/client';
import { BroadcasterService } from './broadcaster.service';

@Injectable()
export class BroadcasterSettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
  ) {}

  /** 방송인 정산정보 등록 및 수정 */
  async insertSettlementInfo(
    dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    const { broadcasterId, ...data } = dto;

    const broadcaster = await this.broadcasterService.findOne({ id: broadcasterId });
    if (!broadcaster) {
      throw new BadRequestException(
        `해당 방송인이 존재하지 않습니다 broadcasterId: ${broadcasterId}`,
      );
    }

    // TODO: 주민등록번호, 휴대전화는 암호화하여 저장

    try {
      return this.prisma.broadcasterSettlementInfo.upsert({
        where: { broadcasterId },
        create: {
          ...data,
          broadcaster: { connect: { id: broadcasterId } },
          confirmation: { create: { rejectionReason: null } },
        },
        update: {
          ...data,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** 방송인 정산정보 조회
   * @param broadcasterId 방송인 고유id
   * @return 정산정보(주민등록번호, 휴대전화는 복호화하여 일부 가린상태) + 검수여부
   */
  async selectBroadcasterSettlementInfo(
    broadcasterId: number,
  ): Promise<BroadcasterSettlementInfo | null> {
    try {
      // TODO: 주민등록번호, 휴대전화는 복호화하여 일부 가린상태로 반환
      return this.prisma.broadcasterSettlementInfo.findUnique({
        where: { broadcasterId },
        include: { confirmation: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
