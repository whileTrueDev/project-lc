import { IsString, IsIn, IsOptional } from 'class-validator';

export class LiveShoppingDTO {
  @IsString()
  streamId: string;

  @IsOptional()
  @IsString()
  requests: string;

  @IsString()
  @IsIn(['registered', 'adjust'])
  progress: string;
}
