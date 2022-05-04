import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDetailRes,
  ExchangeListRes,
  ExchangeUpdateRes,
  GetExchangeListDto,
  UpdateExchangeDto,
} from '@project-lc/shared-types';
import { ExchangeService } from './exchange.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  /** 교환요청 생성 */
  @Post()
  createExchange(
    @Body(ValidationPipe) dto: CreateExchangeDto,
  ): Promise<CreateExchangeRes> {
    return this.exchangeService.createExchange(dto);
  }

  /** 특정 반품요청 상세 조회 */
  @Get(':exchangeId')
  getExchangeDetail(
    @Param('exchangeId', ParseIntPipe) id: number,
  ): Promise<ExchangeDetailRes> {
    return this.exchangeService.getExchangeDetail(id);
  }

  /** 교환요청 내역 조회 */
  @Get()
  getExchangeList(
    @Query(new ValidationPipe({ transform: true })) dto: GetExchangeListDto,
  ): Promise<ExchangeListRes> {
    return this.exchangeService.getExchangeList(dto);
  }

  /** 교환요청 상태 변경 */
  @Patch(':exchangeId')
  updateExchangeStatus(
    @Param('exchangeId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateExchangeDto,
  ): Promise<ExchangeUpdateRes> {
    return this.exchangeService.updateExchangeStatus(id, dto);
  }
}
