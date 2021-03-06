import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

/** 결제 취소 후 금액이 환불될 계좌의 정보  */
export class TossPaymentCancelAccountInfo {
  /** 취소 금액을 환불받을 계좌의 은행 코드입니다. 은행 코드(https://docs.tosspayments.com/reference/codes#%EC%9D%80%ED%96%89-%EC%BD%94%EB%93%9C)를 참고 */
  @IsString()
  bank: string;

  /** 취소 금액을 환불받을 계좌의 계좌번호 입니다. - 없이 숫자만 넣어야 합니다. */
  @IsString()
  accountNumber: string;

  /** 취소 금액을 환불받을 계좌의 예금주 이름입니다. */
  @IsString()
  holderName: string;
}

/** 토스페이먼츠 결제취소 api 사용시 필요한 데이터 */
export class TossPaymentCancelDto {
  /** 결제승인 후 받았던 paymentKey */
  @IsString()
  paymentKey: string;

  /** 결제취소사유 */
  @IsString()
  cancelReason: string;

  /** 취소금액 - 값이 없는경우 전액 취소처리 */
  @IsNumber()
  @IsOptional()
  cancelAmount?: number;

  /** 현재 환불 가능한 금액입니다. 취소 요청을 안전하게 처리하기 위해서 사용합니다.
    환불 가능한 잔액 정보가 refundableAmount의 값과 다른 경우 해당 요청을 처리하지 않고 에러를 내보냅니다.  */
  @IsNumber()
  @IsOptional()
  refundableAmount?: number;

  @IsOptional()
  @Type(() => TossPaymentCancelAccountInfo)
  /** 결제 취소 후 금액이 환불될 계좌의 정보입니다. 가상계좌 결제에 대해서만 필수입니다. 다른 결제 수단으로 이루어진 결제를 취소할 때는 사용하지 않습니다. */
  refundReceiveAccount?: TossPaymentCancelAccountInfo;
}
