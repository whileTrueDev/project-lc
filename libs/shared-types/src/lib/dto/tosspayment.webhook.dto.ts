// 토스로부터 전달되는 데이터로 class-validator 지정하지 않음.
/** 토스로부터 가상계좌 이벤트시 전달되는 데이터 형태 */
export class TossVirtualAccountDto {
  /** createdAt: 웹훅이 생성될 때의 시간입니다. 이 값으로 웹훅이 발행된 순서를 알 수 있습니다. ISO 8601 형식인 yyyy-MM-dd'T'HH:mm:ss.SSS를 사용합니다. */
  createdAt: string;
  /** secret: 가상계좌 웹훅 요청이 정상적인 요청인지 검증하기 위한 값입니다. 이 값이 결제 승인 API의 응답으로 돌아온 secret과 같으면 정상적인 요청입니다. */
  secret: string | null;
  /** status: 입금 처리 상태입니다. 고객이 가상계좌에 입금하면 값이 DONE입니다. 입금이 취소되면 값이 CANCELED 입니다. */
  status: 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'WATING_FOR_DEPOSIT';
  /** orderId: 가맹점에서 주문건에 대해 발급한 고유 ID입니다. */
  orderId: string;
}
/** 토스로부터 가상계좌 이벤트시 전달되는 데이터 형태 */
export class TossVirtualAccountTranslatedDto {
  constructor(partial: Partial<TossVirtualAccountTranslatedDto>) {
    return Object.assign(this, partial);
  }

  /** createdAt: 웹훅이 생성될 때의 시간입니다. 이 값으로 웹훅이 발행된 순서를 알 수 있습니다. ISO 8601 형식인 yyyy-MM-dd'T'HH:mm:ss.SSS를 사용합니다. */
  createdAt: string;
  /** secret: 가상계좌 웹훅 요청이 정상적인 요청인지 검증하기 위한 값입니다. 이 값이 결제 승인 API의 응답으로 돌아온 secret과 같으면 정상적인 요청입니다. */
  secret: string | null;
  /** status: 입금 처리 상태입니다. 고객이 가상계좌에 입금하면 값이 DONE입니다. 입금이 취소되면 값이 CANCELED 입니다. */
  status: 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'WATING_FOR_DEPOSIT';
  /** orderId: 가맹점에서 주문건에 대해 발급한 고유 ID, 크크쇼에서의 Order.orderCode와 동일하므로 가독성 향상을 위해 orderCode로 이름 변경. */
  orderCode: string;
}
