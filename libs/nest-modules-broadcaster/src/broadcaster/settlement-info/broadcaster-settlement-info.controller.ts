import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterSettlementInfoDto,
  BroadcasterSettlementInfoRes,
} from '@project-lc/shared-types';
import { BroadcasterSettlementInfo } from '.prisma/client';
import { BroadcasterSettlementInfoService } from './broadcaster-settlement-info.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('broadcaster/settlement-info')
@Controller('broadcaster/settlement-info')
export class BroadcasterSettlementInfoController {
  constructor(private readonly service: BroadcasterSettlementInfoService) {}

  /** 방송인 정산정보 등록 */
  @Post()
  public async insertSettlementInfo(
    @Body(ValidationPipe) dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    return this.service.insertSettlementInfo(dto);
  }

  /** 방송인 정산등록정보 조회 */
  @Get(':broadcasterId')
  public async selectBroadcasterSettlementInfo(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementInfoRes> {
    return this.service.selectBroadcasterSettlementInfo(broadcasterId);
  }
}
