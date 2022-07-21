import { GoodsInformationSubject } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateGoodsCategoryDto {
  categoryCode?: string;

  @IsDefined({ message: '이름을 입력해주세요.' })
  @IsString()
  @MinLength(1, { message: '이름을 1자 이상 입력해주세요' })
  name: string;

  mainCategoryFlag: boolean;
  parentCategoryId?: number;

  /** 상품정보제공고시 템플릿 연결 정보 */
  @IsDefined({ message: '품목을 설정해주세요.' })
  @IsNumber()
  informationSubjectId: GoodsInformationSubject['id'];

  imageSrc?: string;
}

export class UpdateGoodsCategoryDto {
  @IsOptional() @IsString() categoryCode?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsBoolean() mainCategoryFlag?: boolean;
  @IsOptional() @IsNumber() parentCategoryId?: number;
  @IsOptional() @IsNumber() informationSubjectId?: GoodsInformationSubject['id'];
  @IsOptional() @IsString() imageSrc?: string;
}

/** 상품카테고리 목록 조회 DTO */
export class FindGoodsCategoryDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean() mainCategoryFlag?: boolean = false;
  @IsOptional() @Type(() => Number) @IsNumber() parentCategoryId?: number;
}
