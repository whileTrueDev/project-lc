export class CreateGoodsCategoryDto {
  categoryCode: string;
  name: string;
  mainCategoryFlag: boolean;
  parentCategoryId?: number;
}

export class UpdateGoodsCategoryDto {
  categoryCode?: string;
  name?: string;
  mainCategoryFlag?: boolean;
  parentCategoryId?: number;
}
