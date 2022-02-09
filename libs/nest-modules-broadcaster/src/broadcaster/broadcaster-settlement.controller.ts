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
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  BroadcasterSettlementInfoDto,
  BroadcasterSettlementInfoRes,
} from '@project-lc/shared-types';
import { BroadcasterSettlementInfo } from '.prisma/client';
import { BroadcasterSettlementService } from './broadcaster-settlement.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('broadcaster/settlement-info')
export class BroadcasterSettlementController {
  constructor(
    private readonly broadcasterSettlementService: BroadcasterSettlementService,
  ) {}

  /** 방송인 정산등록정보 등록 */
  @Post()
  public async insertSettlementInfo(
    @Body(ValidationPipe) dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    return this.broadcasterSettlementService.insertSettlementInfo(dto);
  }

  /** 방송인 정산등록정보 조회 */
  @Get(':broadcasterId')
  public async selectBroadcasterSettlementInfo(
    @Param('broadcasterId', ParseIntPipe) broadcasterId: number,
  ): Promise<BroadcasterSettlementInfoRes> {
    return this.broadcasterSettlementService.selectBroadcasterSettlementInfo(
      broadcasterId,
    );
  }
}
