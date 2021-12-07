import { IsString } from 'class-validator';

export class BroadcasterDTO {
  @IsString()
  email: string;

  @IsString()
  userNickname: string;
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;
