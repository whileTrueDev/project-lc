import { Prisma } from '@prisma/client';
import { IsOptional, IsString, IsNumber, IsJSON } from 'class-validator';

export class CreateEventPopupDto {
  @IsString()
  key: string;

  @IsString()
  name: string;

  @IsNumber()
  priority: number;

  @IsString()
  @IsOptional()
  linkUrl?: string; // 클릭시 이동할 url. 없으면 일반 이미지 팝업

  @IsString()
  imageUrl: string; // s3에 저장된 팝업에 표시될 이미지 url

  @IsJSON()
  displayPath: Prisma.JsonArray; // 팝업이 표시될 크크쇼 페이지 경로 ['/bc','goods'] 이런형태
}

export class UpdateEventPopupDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  priority?: number;

  @IsString()
  @IsOptional()
  linkUrl?: string; // 클릭시 이동할 url. 없으면 일반 이미지 팝업

  @IsString()
  @IsOptional()
  imageUrl?: string; // s3에 저장된 팝업에 표시될 이미지 url

  @IsJSON()
  @IsOptional()
  displayPath?: Prisma.JsonArray; // 팝업이 표시될 크크쇼 페이지 경로 ['/bc','goods'] 이런형태
}
