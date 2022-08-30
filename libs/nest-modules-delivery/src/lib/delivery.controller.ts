import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { DeliveryDto, DeliveryManyDto } from '@project-lc/shared-types';
import { DeliveryService } from './delivery.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('export', 'order')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('start')
  public async deliveryStart(
    @Body(new ValidationPipe({ transform: true })) dto: DeliveryDto,
  ): Promise<unknown> {
    return this.deliveryService.deliveryStart(dto);
  }

  @Post('start/many')
  public async deliveryStartMany(
    @Body(new ValidationPipe({ transform: true })) dto: DeliveryManyDto,
  ): Promise<unknown> {
    return this.deliveryService.deliveryStartMany(dto.deliveryDTOs);
  }

  @Post('done')
  public async deliveryDone(
    @Body(new ValidationPipe({ transform: true })) dto: DeliveryDto,
  ): Promise<unknown> {
    return this.deliveryService.deliveryDone(dto);
  }

  @Post('done/many')
  public async deliveryDoneMany(
    @Body(new ValidationPipe({ transform: true })) dto: DeliveryManyDto,
  ): Promise<unknown> {
    return this.deliveryService.deliveryDoneMany(dto.deliveryDTOs);
  }
}
