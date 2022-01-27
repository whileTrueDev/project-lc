import { IsNumber, IsString } from 'class-validator';

export class BroadcasterDTO {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  userNickname: string;
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;

export type BroadcasterWithoutUserNickName = Omit<BroadcasterDTO, 'userNickname'>;
