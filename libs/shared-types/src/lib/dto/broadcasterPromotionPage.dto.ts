import { IsString, IsInt, IsOptional } from 'class-validator';

export class BroadcasterPromotionPageDto {
  @IsInt() broadcasterId: number;
  @IsOptional() @IsString() comment?: string;
}

export class BroadcasterPromotionPageUpdateDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  broadcasterId?: number;
}
