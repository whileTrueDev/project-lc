import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { CreateRefundDto, CreateRefundRes } from '@project-lc/shared-types';
import { RefundService } from './refund.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('refund')
export class RefundController {
  constructor(private readonly refundService: RefundService) {}

  /** 결제취소 테스트위해 결제데이터 필요하여 만들었음. 나중에 삭제필요 */
  @Post('fake-payment')
  fakePayment(): Promise<any> {
    return this.refundService.makeFakeOrderWithFakePayment();
  }

  /** 환불데이터 생성 */
  @Post()
  createRefund(@Body(ValidationPipe) dto: CreateRefundDto): Promise<CreateRefundRes> {
    return this.refundService.createRefund(dto);
  }
}
