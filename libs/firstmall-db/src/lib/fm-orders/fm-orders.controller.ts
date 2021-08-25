import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { FindFmOrdersDto } from '@project-lc/shared-types';
import { JwtAuthGuard } from '@project-lc/nest-modules';
import { FmOrdersService } from './fm-orders.service';

@UseGuards(JwtAuthGuard)
@Controller('fm-orders')
export class FmOrdersController {
  constructor(private readonly fmOrdersService: FmOrdersService) {}

  @Get()
  findOrders(@Query(ValidationPipe) dto: FindFmOrdersDto) {
    return this.fmOrdersService.findOrders(dto);
  }
}
