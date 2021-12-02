import { IsNumber, IsString } from 'class-validator';

export class CreateBroadcasterChannelDto {
  @IsNumber()
  broadcasterId: number;

  @IsString()
  url: string;
}
