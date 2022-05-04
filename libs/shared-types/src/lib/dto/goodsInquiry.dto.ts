import { Customer, Goods, Seller } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { DefaultPaginationDto } from './pagination.dto';

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

export class FindManyGoodsInquiryDto extends DefaultPaginationDto {
  @Type(() => Number) @IsOptional() @IsInt() goodsId?: Goods['id'];
  @Type(() => Number) @IsOptional() @IsInt() customerId?: Customer['id'];
  @Type(() => Number) @IsOptional() @IsInt() sellerId?: Seller['id'];
}
