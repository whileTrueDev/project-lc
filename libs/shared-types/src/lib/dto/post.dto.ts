import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class NoticePostDto {
  @IsString()
  title: string;

  @IsString()
  url: string;
}

export class NoticePatchDto {
  @IsNumber()
  id: number;

  @IsBoolean()
  postingFlag: boolean;
}
