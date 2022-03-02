import { Injectable } from '@nestjs/common';
import { KkshowMain } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { KkshowMainDto, KkshowMainResData } from '@project-lc/shared-types';
import { jsonToResType } from '@project-lc/utils';

@Injectable()
export class KkshowMainService {
  constructor(private readonly prisma: PrismaService) {}

  // /** 크크쇼메인데이터(JSON타입) 을 KkshowMainResData 반환타입으로 캐스팅 */
  private jsonToResType(data: KkshowMain): KkshowMainResData {
    return jsonToResType(data);
  }

  private async findFirst(): Promise<KkshowMain> {
    return this.prisma.kkshowMain.findFirst();
  }

  /** 크크쇼메인데이터 생성(데이터가 없는 경우) 혹은 수정(데이터가 존재하는 경우) */
  async upsert(data: KkshowMainDto): Promise<KkshowMainResData> {
    const existData = await this.findFirst();

    if (existData) {
      const updated = await this.prisma.kkshowMain.update({
        where: { id: existData.id },
        data,
      });
      return this.jsonToResType(updated);
    }
    const created = await this.prisma.kkshowMain.create({
      data,
    });
    return this.jsonToResType(created);
  }

  /** 크크쇼 메인데이터 조회, 없으면 Null반환 */
  async read(): Promise<KkshowMainResData | null> {
    const data = await this.findFirst();
    if (data) {
      return this.jsonToResType(data);
    }
    return null;
  }
}
