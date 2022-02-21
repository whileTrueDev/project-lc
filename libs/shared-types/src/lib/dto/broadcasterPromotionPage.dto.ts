import { IsString, IsInt, IsOptional } from 'class-validator';

export class BroadcasterPromotionPageDto {
  @IsString()
  url: string;

  @IsInt()
  broadcasterId: number;
}

export class BroadcasterPromotionPageUpdateDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  broadcasterId?: number;
}
