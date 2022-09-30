import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LiveShoppingEmbed } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { KkshowLiveEmbedService } from './kkshow-live-embed.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('kkshow-live-embed')
@CacheClearKeys('kkshow-live-embed')
export class KkshowLiveEmbedController {
  constructor(private readonly service: KkshowLiveEmbedService) {}

  /**
   * 임베드 레코드 목록 조회
   */
  @Get()
  public async findAll(): Promise<LiveShoppingEmbed[]> {
    return this.service.findAll();
  }
}
