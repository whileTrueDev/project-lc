import { IsString } from 'class-validator';

export class BroadcasterDTO {
  @IsString()
  email: string;

  @IsString()
  userNickname: string;

  // @IsOptional()
  // @IsString()
  // afreecaId: string;

  // @IsOptional()
  // @IsString()
  // twitchId: string;

  // @IsOptional()
  // @IsString()
  // youtubeId: string;

  // @IsOptional()
  // @IsString()
  // channelUrl: string;
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;
