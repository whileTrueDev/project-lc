import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { throwError } from 'rxjs';
import { NicknameAndPrice, PriceSum, NicknameAndText } from '@project-lc/shared-types';
@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getRanking(): Promise<NicknameAndPrice[]> {
    const topRanks = await this.prisma.liveCommerceRanking.groupBy({
      by: ['nickname'],
      where: {
        loginFlag: {
          not: '0',
        },
      },
      _sum: {
        price: true,
      },
    });
    if (!topRanks) throwError('Cannot Get Data From Db');
    return topRanks;
  }

  async getTotalSoldPrice(): Promise<PriceSum> {
    const totalSoldPrice = await this.prisma.liveCommerceRanking.aggregate({
      _sum: {
        price: true,
      },
    });
    if (!totalSoldPrice) throwError('Cannot Get Data From Db');
    return totalSoldPrice;
  }

  async getMessageAndNickname(): Promise<NicknameAndText[]> {
    const messageAndNickname = await this.prisma.liveCommerceRanking.findMany({
      select: {
        nickname: true,
        text: true,
      },
    });
    if (!messageAndNickname) throwError('Cannot Get Data From Db');
    return messageAndNickname;
  }
}
