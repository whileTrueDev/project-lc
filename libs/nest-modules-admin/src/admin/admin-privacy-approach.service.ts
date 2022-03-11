import { Injectable } from '@nestjs/common';
import { PrivacyApproachHistory } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class AdminPrivacyApproachSevice {
  constructor(private readonly prisma: PrismaService) {}
  /** 히스토리 남기는 함수 */
  createPrivacyApproachHistory(req, dto): Promise<PrivacyApproachHistory> {
    const { ip, user } = req;

    return this.prisma.privacyApproachHistory.create({
      data: {
        adminEmail: user.sub,
        ip,
        infoType: dto.infoType,
        actionType: dto.actionType,
      },
    });
  }
}
