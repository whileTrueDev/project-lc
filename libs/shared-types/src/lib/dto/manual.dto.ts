import { UserType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class PostManualDto {
  @IsEnum(UserType)
  target: UserType; // seller | broadcaster

  @IsString()
  mainCategory: string; // 해당 항목이 속하는 대분류 - 마이페이지/페이지 구분과 유사 (예: 상품, 라이브커머스)

  @IsString()
  title: string; // 이용안내 주제(예: 상품 등록, 라이브커머스 등록)

  @IsString()
  description: string; // 주제에 대한 짧은 설명 (예: 크크쇼에 상품을 등록하는 방법입니다.)

  @IsNumber()
  order: number; // 이용안내 표시될 순서

  @IsString()
  contents: string; // 이용안내 내용

  @IsString()
  @IsOptional()
  linkPageRouterPath?: string; // 연결될 마이페이지 routerPath (MypageLink의 href)
}

export class EditManualDto {
  @IsEnum(UserType)
  @IsOptional()
  target?: UserType; // seller | broadcaster

  @IsString()
  @IsOptional()
  mainCategory: string; // 해당 항목이 속하는 대분류 - 마이페이지/페이지 구분과 유사 (예: 상품, 라이브커머스)

  @IsString()
  @IsOptional()
  title?: string; // 이용안내 주제(예: 상품 등록, 라이브커머스 등록)

  @IsString()
  @IsOptional()
  description?: string; // 주제에 대한 짧은 설명 (예: 크크쇼에 상품을 등록하는 방법입니다.)

  @IsNumber()
  @IsOptional()
  order?: number; // 이용안내 표시될 순서

  @IsString()
  @IsOptional()
  contents?: string; // 이용안내 내용

  @IsString()
  @IsOptional()
  linkPageRouterPath?: string; // 연결될 마이페이지 routerPath (MypageLink의 href)
}
