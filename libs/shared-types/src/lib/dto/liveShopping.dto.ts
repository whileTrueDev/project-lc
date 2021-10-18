import { IsString, IsIn, IsOptional, IsNumber, IsDate } from 'class-validator';

export class LiveShoppingDTO {
  @IsNumber()
  id: number;

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
  @IsIn(['registered', 'adjust', 'confirm', 'cancel'])
  progress: string;

  @IsOptional()
  @IsDate()
  broadcastStartDate: string;

  @IsOptional()
  @IsDate()
  broadcastEndDate: string;

  @IsOptional()
  @IsDate()
  sellStartDate: string;

  @IsOptional()
  @IsDate()
  sellEndDate: string;

  @IsOptional()
  @IsString()
  rejectionReason: string;

  @IsOptional()
  @IsString()
  videoUrl: string;

  @IsDate()
  createDate: string;
}

export type LiveShoppingRegistDTO = Pick<
  LiveShoppingDTO,
  'requests' | 'goods_id' | 'contactId' | 'streamId' | 'progress'
>;
