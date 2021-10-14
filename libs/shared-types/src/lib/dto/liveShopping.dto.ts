import { IsString, IsIn, IsOptional, IsNumber, IsDate } from 'class-validator';

export class LiveShoppingDTO {
  @IsString()
  streamId: string;

  @IsOptional()
  @IsString()
  broadcasterId: string;

  @IsString()
  sellerId: string;

  @IsNumber()
  goods_id: number;

  @IsNumber()
  contactId: number;

  @IsOptional()
  @IsString()
  requests: string;

  @IsString()
  @IsIn(['registered', 'adjust'])
  progress: string;

  @IsDate()
  createDate: string;
}
