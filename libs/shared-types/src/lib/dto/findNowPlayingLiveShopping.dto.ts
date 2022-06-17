import { Broadcaster, Goods } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsNumberString, IsOptional } from 'class-validator';

export class FindNowPlayingLiveShoppingDto {
  @Type(() => Number) @IsNumber() @IsOptional() broadcasterId?: Broadcaster['id'];
  @Type(() => Number) @IsNumber() @IsOptional() goodsId?: Goods['id'];

  @IsArray() @IsNumberString({}, { each: true }) @IsOptional() goodsIds?: Array<
    Goods['id']
  >;
}
