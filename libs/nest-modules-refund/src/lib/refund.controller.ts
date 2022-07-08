import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CreateRefundDto,
  CreateRefundRes,
  GetRefundListDto,
  RefundDetailRes,
  RefundListRes,
} from '@project-lc/shared-types';
import { RefundService } from './refund.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('refund')
@Controller('refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  /** 환불데이터 생성 */
  @Post()
  createRefund(@Body(ValidationPipe) dto: CreateRefundDto): Promise<CreateRefundRes> {
    return this.refundService.createRefund(dto);
  }

  /** 환불내역 목록 조회 - 소비자, 판매자 */
  @Get('list')
  getRefundList(
    @Query(new ValidationPipe({ transform: true }))
    dto: GetRefundListDto,
  ): Promise<RefundListRes> {
    return this.refundService.getRefundList(dto);
  }

  /** 특정 환불내역 상세 조회 */
  @Get()
  getRefundDetail(
    @Query('refundId', ParseIntPipe) refundId: number,
  ): Promise<RefundDetailRes> {
    return this.refundService.getRefundDetail({ refundId });
  }
}
