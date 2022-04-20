import { Controller, UseInterceptors } from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { OrderService } from './order.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 주문생성 */

  /** 주문목록조회 */

  /** 개별주문조회 */

  /** 주문수정 */

  /** 주문 삭제 */
}
