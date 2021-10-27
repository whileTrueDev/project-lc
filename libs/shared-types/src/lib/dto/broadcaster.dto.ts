import { IsString, IsOptional } from 'class-validator';

export class BroadcasterDTO {
  @IsString()
  userId: string;

  @IsString()
  userNickname: string;

  @IsOptional()
  @IsString()
  afreecaId: string;

  @IsOptional()
  @IsString()
  twitchId: string;

  @IsOptional()
  @IsString()
  youtubeId: string;

  @IsOptional()
  @IsString()
  channelUrl: string;
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;
