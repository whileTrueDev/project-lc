import { Injectable } from '@nestjs/common';
import { KkshowMain, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  KkshowMainBestBroadcasterItem,
  KkshowMainBestLiveItem,
  KkshowMainCarouselItem,
  KkshowMainResData,
  KkshowMainDto,
  KkShowMainLiveTrailer,
} from '@project-lc/shared-types';

@Injectable()
export class AdminKkshowMainService {
  constructor(private readonly prisma: PrismaService) {}

  /** JSON데이터인 value를 특정 타입으로 캐스팅하여 반환 */
  private parse<T>(value: Prisma.JsonValue): T {
    return JSON.parse(JSON.stringify(value));
  }

  /** 크크쇼메인데이터(JSON타입) 을 KkshowMainResData 반환타입으로 캐스팅 */
  private jsonToResType(data: KkshowMain): KkshowMainResData {
    const carousel = this.parse<KkshowMainCarouselItem[]>(data.carousel);
    const trailer = this.parse<KkShowMainLiveTrailer>(data.trailer);
    const bestLive = this.parse<KkshowMainBestLiveItem[]>(data.bestLive);
    const bestBroadcaster = this.parse<KkshowMainBestBroadcasterItem[]>(
      data.bestBroadcaster,
    );
    return {
      carousel,
      trailer,
      bestLive,
      bestBroadcaster,
    };
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
