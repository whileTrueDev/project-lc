import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateExchangeDto,
  CreateExchangeRes,
  ExchangeDeleteRes,
  ExchangeDetailRes,
  ExchangeListRes,
  ExchangeUpdateRes,
  GetExchangeListDto,
  UpdateExchangeDto,
} from '@project-lc/shared-types';
import { ExchangeService } from './exchange.service';

@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('exchange')
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

  /** 특정 교환요청 상세 조회 */
  @Get(':exchangeCode')
  getExchangeDetail(
    @Param('exchangeCode') exchangeCode: string,
  ): Promise<ExchangeDetailRes> {
    return this.exchangeService.getExchangeDetail(exchangeCode);
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

  /** 교환요청 삭제 */
  @Delete(':exchangeId')
  deleteExchange(
    @Param('exchangeId', ParseIntPipe) id: number,
  ): Promise<ExchangeDeleteRes> {
    return this.exchangeService.deleteExchange(id);
  }
}
