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
}

export type BroadcasterDTOWithoutUserId = Omit<BroadcasterDTO, 'userId'>;

export type BroadcasterWithoutUserNickName = Omit<BroadcasterDTO, 'userNickname'>;
