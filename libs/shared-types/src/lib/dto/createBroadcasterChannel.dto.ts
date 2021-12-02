import { IsNumber, IsString } from 'class-validator';

export class CreateBroadcasterChannelDto {
  /** Broadcaster.id (userId가 아님) */
  @IsNumber()
  broadcasterId: number;

  @IsString()
  url: string;
}
