import { Controller, Get, Query } from '@nestjs/common';
import { FindFmOrdersDto } from '@project-lc/shared-types';
import { FmOrdersService } from './fm-orders.service';

@Controller('fm-orders')
export class FmOrdersController {
  constructor(private readonly fmOrdersService: FmOrdersService) {}

  @Get()
  findOrders(@Query() dto: FindFmOrdersDto) {
    return this.fmOrdersService.findOrders(dto);
  }
}
