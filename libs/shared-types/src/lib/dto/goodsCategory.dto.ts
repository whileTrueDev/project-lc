import { GoodsInformationSubject } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateGoodsCategoryDto {
  categoryCode?: string;
  name: string;
  mainCategoryFlag: boolean;
  parentCategoryId?: number;
  /** 상품정보제공고시 템플릿 연결 정보 */
  informationSubjectId: GoodsInformationSubject['id'];
}

export class UpdateGoodsCategoryDto {
  categoryCode?: string;
  name?: string;
  mainCategoryFlag?: boolean;
  parentCategoryId?: number;
  informationSubjectId?: GoodsInformationSubject['id'];
}

/** 상품카테고리 목록 조회 DTO */
export class FindGoodsCategoryDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean() mainCategoryFlag?: boolean = false;
  @IsOptional() @Type(() => Number) @IsNumber() parentCategoryId?: number;
}
