import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { CreateExchangeDto, CreateExchangeRes } from '@project-lc/shared-types';
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
}
