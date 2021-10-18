import { IsString, IsOptional, IsDate } from 'class-validator';

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
}
