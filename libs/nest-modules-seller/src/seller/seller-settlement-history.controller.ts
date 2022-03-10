import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SellerSettlements } from '@prisma/client';
import { HttpCacheInterceptor, SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { FindSettlementHistoryDto } from '@project-lc/shared-types';
import { SellerSettlementService } from './seller-settlement.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('seller/settlement-history')
export class SellerSettlementHistoryController {
  constructor(private readonly sellerSettlementService: SellerSettlementService) {}

  // 본인의 정산 대상 목록 조회
  @Get()
  public async findSettlementHistory(
    @SellerInfo() sellerInfo: UserPayload,
    @Query(ValidationPipe) dto: FindSettlementHistoryDto,
  ): Promise<SellerSettlements[]> {
    return this.sellerSettlementService.findSettlementHistory(sellerInfo.id, {
      round: dto.round,
    });
  }

  // 본인의 정산 대상 년도 목록 조회
  @Get('years')
  public async findSettlementHistoryYears(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryYears(sellerInfo.sub);
  }

  // 본인의 정산 대상 월 목록 조회
  @Get('months')
  public async findSettlementHistoryMonths(
    @SellerInfo() sellerInfo: UserPayload,
    @Query('year') year: string,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryMonths(sellerInfo.sub, year);
  }

  // 본인의 정산 대상 월 목록 조회
  @Get('rounds')
  public async findSettlementHistoryRounds(
    @SellerInfo() sellerInfo: UserPayload,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryRounds(
      sellerInfo.sub,
      year,
      month,
    );
  }
}
