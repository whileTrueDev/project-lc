import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
} from '@nestjs/common';
import {
  KKsPaymentProviders,
  TossVirtualAccountDto,
  TossVirtualAccountTranslatedDto,
} from '@project-lc/shared-types';
import { Request } from 'express';
import PaymentWebhookService from './payment-webhook.service';

/**
 * 페이먼트사 결제 이벤트 알림(웹훅)에 대한 처리를 위한 컨트롤러
 */
@Controller('payment/webhook')
export class PaymentWebhookController {
  constructor(private readonly paymentWebhookService: PaymentWebhookService) {}

  /**
   * TossPayments 전달되는 데이터 형태
   *  - `eventType`: 웹훅의 이벤트 타입입니다.
   *    - `PAYMENT_STATUS_CHANGED`: 결제 상태가 변경되었을 때
   *    - `PAYOUT_STATUS_CHANGED`: 지급대행 상태가 변경됐을 때 돌아옵니다.
   *    - `METHOD_UPDATE`: 고객의 결제수단이 등록/변경/삭제됐을 때 돌아옵니다.
   *    - `CUSTOMER_STATUS_CHANGED`: 브랜드페이 고객의 상태 변경이 일어났을 때 돌아옵니다.
   *  - `createdAt`: 웹훅이 생성될 때의 시간입니다. 이 값으로 웹훅이 발행된 순서를 알 수 있습니다. ISO 8601 형식인 yyyy-MM-dd'T'HH:mm:ss.SSS를 사용합니다.
   *  - `data`: 이벤트와 관련한 데이터입니다. 이벤트 타입에 따라 형태가 달라집니다. 아래 이벤트 타입 알아보기에서 살펴보세요.
   *  - 응답으로 HTTP 200 OK이 돌아올 경우 성공으로 판단하며, 이외에는 실패로 판단합니다. 실패할 경우 성공할 때까지 몇 차례 재시도합니다.
   */
  @Post('toss')
  public async tossCallback(): Promise<any> {
    //
    throw new NotFoundException('TossPayments - 아직 웹훅 처리 준비되지 않음');
  }

  @Get('toss')
  public async tossCallbackHealthCheck(): Promise<string> {
    throw new NotFoundException('TossPayments - 아직 웹훅 처리 준비되지 않음');
  }

  /**
   * 가상계좌로 결제한 고객이 금액을 입금하거나 입금을 취소하면 토스페이먼츠에 의해 여기로 요청됨.
   * 가상계좌 웹훅 이벤트 본문은 아래와 같은 형태입니다.
   *  - `secret`: 가상계좌 웹훅 요청이 정상적인 요청인지 검증하기 위한 값입니다. 이 값이 결제 승인 API의 응답으로 돌아온 secret과 같으면 정상적인 요청입니다.
      - `status`: 입금 처리 상태입니다. 고객이 가상계좌에 입금하면 값이 DONE입니다. 입금이 취소되면 값이 CANCELED 입니다.
        - `DONE` : 가상계좌에 입금 되었습니다.
        - `CANCELED` : 가상계좌 입금이 취소되었습니다.
        - `PARTIAL_CANCELED` : 가상계좌 입금 부분 취소가 이루어졌습니다.
      - `orderId`: 가맹점에서 주문건에 대해 발급한 고유 ID입니다.
   */
  @Post('toss/virtual-account')
  public async tossVirtualAccountCallback(
    @Body() body: TossVirtualAccountDto,
  ): Promise<string> {
    const dto = new TossVirtualAccountTranslatedDto({
      createdAt: body.createdAt,
      secret: body.secret,
      status: body.status,
      orderCode: body.orderId,
    });
    // secret 검증
    const secretValidated = await this.paymentWebhookService.checkDepositSecret(
      KKsPaymentProviders.TossPayments,
      dto,
    );
    if (!secretValidated)
      throw new BadRequestException('TossPayments - Secret mismatched');
    // status 에 따른 가상계좌 작업 처리
    const result = await this.paymentWebhookService.depositProcessing(
      KKsPaymentProviders.TossPayments,
      dto,
    );
    if (!result)
      throw new InternalServerErrorException(
        'TossPayments - VirtualAccount processing failed',
      );
    return 'Ok';
  }

  @Get('toss/virtual-account')
  public async tossVirtualAccountCallbackHealthCheck(): Promise<string> {
    return 'Ready';
  }
}
