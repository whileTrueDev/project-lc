import { Customer, Goods, GoodsReview, Seller } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DefaultPaginationDto } from './pagination.dto';

export class GoodsReviewImageDto {
  @IsString() imageUrl: string;
}

export class GoodsReviewCreateDto {
  @IsString() content: string;
  @Type(() => Number) @IsNumber() goodsId: Goods['id'];
  @Type(() => Number) @IsNumber() writerId: Customer['id'];
  @Type(() => Number) @IsNumber() rating: number;
  @Type(() => Number) @IsNumber() orderItemId: number;

  @Type(() => GoodsReviewImageDto)
  @ValidateNested({ each: true })
  @IsArray()
  images: GoodsReviewImageDto[];
}

export class GoodsReviewUpdateDto {
  @IsOptional() @IsString() content: string;
  @IsOptional() @Type(() => Number) @IsNumber() goodsId: Goods['id'];
  @IsOptional() @Type(() => Number) @IsNumber() writerId: Customer['id'];
  @IsOptional() @Type(() => Number) @IsNumber() rating: number;

  @IsOptional()
  @Type(() => GoodsReviewImageDto)
  @ValidateNested({ each: true })
  images: GoodsReviewImageDto[];
}

export class FindManyGoodsReviewDto extends DefaultPaginationDto {
  @Type(() => Number) @IsOptional() @IsInt() goodsId?: Goods['id'];
  @Type(() => Number) @IsOptional() @IsInt() customerId?: Customer['id'];
  @Type(() => Number) @IsOptional() @IsInt() sellerId?: Seller['id'];
}

export class GoodsReviewCommentCreateDto {
  @IsString() content: string;
  @Type(() => Number) @IsOptional() @IsInt() customerId?: Customer['id'];
  @Type(() => Number) @IsOptional() @IsInt() sellerId?: Seller['id'];
}

export class GoodsReviewCommentUpdateDto {
  @IsOptional() @IsString() content: string;
  @Type(() => Number) @IsOptional() @IsInt() customerId?: Customer['id'];
  @Type(() => Number) @IsOptional() @IsInt() sellerId?: Seller['id'];
  @Type(() => Number) @IsOptional() @IsInt() reviewId?: GoodsReview['id'];
}
