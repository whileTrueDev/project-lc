import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

/** 상품 문의 생성 DTO */
export class GoodsInquiryCreateDto {
  @Type(() => Number) @IsInt() goodsId: number;
  @Type(() => Number) @IsInt() writerId: number;
  @IsString() content: string;
}

/** 상품 문의 수정 DTO */
export class GoodsInquiryUpdateDto {
  @IsOptional() @Type(() => Number) @IsInt() goodsId?: number;
  @IsOptional() @Type(() => Number) @IsInt() writerId?: number;
  @IsOptional() @IsString() content?: string;
}

/** 상품 문의 답변 생성 DTO */
export class GoodsInquiryCommentDto {
  @IsOptional() @Type(() => Number) @IsInt() adminId?: number;
  @IsOptional() @Type(() => Number) @IsInt() sellerId?: number;
  @IsString() content: string;
}
