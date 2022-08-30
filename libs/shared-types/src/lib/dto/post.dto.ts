import { NoticeTarget } from '@prisma/client';
import { IsBoolean, IsNumber, IsString, IsEnum } from 'class-validator';

export class NoticePostDto {
  @IsString()
  title: string;

  @IsString()
  url: string;

  @IsEnum(NoticeTarget)
  target: NoticeTarget;
}

export class NoticePatchDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  postingFlag: boolean;
}
