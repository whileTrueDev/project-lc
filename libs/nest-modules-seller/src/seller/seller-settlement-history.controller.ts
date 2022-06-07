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
import { SellerSettlementService } from './settlement/seller-settlement.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('seller/settlement-history')
export class SellerSettlementHistoryController {
  constructor(private readonly sellerSettlementService: SellerSettlementService) {}

  // 본인의 정산 대상 목록 조회
  @Get()
  public async findSettlementHistory(
    @SellerInfo() seller: UserPayload,
    @Query(ValidationPipe) dto: FindSettlementHistoryDto,
  ): Promise<SellerSettlements[]> {
    return this.sellerSettlementService.findSettlementHistory(seller.id, {
      round: dto.round,
    });
  }

  // 본인의 정산 대상 년도 목록 조회
  @Get('years')
  public async findSettlementHistoryYears(
    @SellerInfo() seller: UserPayload,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryYears(seller.id);
  }

  // 본인의 정산 대상 월 목록 조회
  @Get('months')
  public async findSettlementHistoryMonths(
    @SellerInfo() seller: UserPayload,
    @Query('year') year: string,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryMonths(seller.id, year);
  }

  // 본인의 정산 대상 월 목록 조회
  @Get('rounds')
  public async findSettlementHistoryRounds(
    @SellerInfo() seller: UserPayload,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<string[]> {
    return this.sellerSettlementService.findSettlementHistoryRounds(
      seller.id,
      year,
      month,
    );
  }
}
