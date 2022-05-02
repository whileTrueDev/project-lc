import { Customer, Goods } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsNumber, IsString, ValidateNested } from 'class-validator';

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
  images: GoodsReviewImageDto[];
}
