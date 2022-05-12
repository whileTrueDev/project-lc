import { BroadcasterPromotionPage } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class BroadcasterDTO {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  userNickname: string;

  @IsOptional()
  BroadcasterPromotionPage?: BroadcasterPromotionPage | null;

  @IsOptional()
  @IsString()
  avatar?: string;
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;

export type BroadcasterWithoutUserNickName = Omit<BroadcasterDTO, 'userNickname'>;

export type BroadcasterOnlyNickNameAndAvatar = Pick<
  BroadcasterDTO,
  'userNickname' | 'avatar'
>;
