import { IsString, IsIn, IsOptional, IsNumber } from 'class-validator';

export class LiveShoppingDTO {
  @IsString()
  streamId: string;

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
}
