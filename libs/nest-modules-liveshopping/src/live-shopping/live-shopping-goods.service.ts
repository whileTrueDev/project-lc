import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class LiveShoppingGoodsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 특정 라이브 쇼핑의 현황(응원메시지 데이터) 조회 - 생성일 내림차순 조회(최신순)
   * @param liveShoppingId 라이브쇼핑 고유id
   */
  /** 해당 fmGoodsSeq가 라이브쇼핑에 등록되어 있으면 true를 반환 */
  async checkIsLiveShoppingFmGoodsSeq(fmGoodsSeq: number): Promise<boolean> {
    const liveShoppingFmGoodsSeq = await this.prisma.liveShopping.findFirst({
      where: {
        fmGoodsSeq: Number(fmGoodsSeq),
      },
    });
    if (liveShoppingFmGoodsSeq) return true;
    return false;
  }
}
