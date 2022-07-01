import {
  Customer,
  Order,
  OrderItem,
  OrderItemOption,
  ProcessStatus,
  Refund,
  Seller,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

//* ------- 생성 dto -------

/** 반품요청 이미지 생성dto */
export class CreateReturnImageDto {
  /** 이미지 url 주소 */
  @IsString()
  imageUrl: string;
}

/** 반품상품 생성 dto */
export class CreateReturnItemDto {
  /** 주문상품 고유번호 */
  @IsNumber()
  orderItemId: OrderItem['id'];

  /** 주문상품 옵션 고유번호 */
  @IsNumber()
  orderItemOptionId: OrderItemOption['id'];

  /** 개수 */
  @IsNumber()
  amount: number;
}

/** 반품 생성 dto */
export class CreateReturnDto {
  /** 반품요청할 상품의 주문 고유번호 */
  @IsNumber()
  orderId: Order['id'];

  /** 반품사유 */
  @IsString()
  reason: string;

  /** 회수지 주소 */
  @IsString()
  @IsOptional()
  returnAddress?: string;

  /** 환불계좌번호 */
  @IsString()
  @IsOptional()
  refundAccount?: string;

  /** 환불계좌예금주명 */
  @IsString()
  @IsOptional()
  refundAccountHolder?: string;

  /** 환불은행 Bank.bankCode */
  @IsString()
  @IsOptional()
  refundBank?: string;

  /** 반품 상품들 */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnItemDto)
  items: CreateReturnItemDto[];

  /** 반품요청시 첨부한 이미지 */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReturnImageDto)
  images?: CreateReturnImageDto[];
}

//* ------- 조회 dto -------
/** 반품요청 내역 조회 dto */
export class GetReturnListDto {
  /** 한 페이지에 몇개 표시할것인지 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  take?: number = 10; // take 값 없을때 기본값

  /** 몇개 건너뛰고 조회할것인지 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  skip?: number = 0;

  /** 특정 소비자의 반품요청 내역 조회시 사용 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  customerId?: Customer['id'];

  /** 특정 판매자가 판매중인 상품이 포함된 반품요청내역 조회시 사용 */
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  sellerId?: Seller['id'];
}

/** 반품요청 상태 변경 dto */
export class UpdateReturnDto {
  /** 반품처리상태  */
  @IsEnum(ProcessStatus)
  @IsOptional()
  status?: ProcessStatus;

  /** 반품요청이 거절된 이유 */
  @IsOptional()
  @IsString()
  rejectReason?: string;

  /** 책임소재(판매자귀책? 구매자귀책?) */
  @IsOptional()
  @IsString()
  responsibility?: string;

  /** 반품메모 */
  @IsOptional()
  @IsString()
  memo?: string;

  /** 연결된 환불정보 고유번호 */
  @IsNumber()
  @IsOptional()
  refundId?: Refund['id'];
}
