import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { OrderCancellationService } from './order-cancellation.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('order-cancellation')
export class OrderCancellationController {
  constructor(private readonly orderCancellationService: OrderCancellationService) {}
}
