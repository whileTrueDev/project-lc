import { IsInt, IsNumber, IsOptional } from 'class-validator';

/** @deprecated */
export class broadcasterProductPromotionDto {
  /** @deprecated */
  @IsInt() fmGoodsSeq: number;
}

/**  방송홍보 레코드 생성 dto */
export class CreateProductPromotionDto {
  /** 상품홍보페이지 id */
  @IsNumber()
  @IsOptional()
  broadcasterPromotionPageId?: number;

  /** 홍보하는 방송인 고유번호 */
  @IsNumber()
  broadcasterId: number;

  /** project-lc 상품 고유번호 */
  @IsNumber()
  goodsId: number;

  @IsNumber()
  @IsOptional()
  broadcasterCommissionRate?: number;

  @IsNumber()
  @IsOptional()
  whiletrueCommissionRate?: number;
}

/** 방송홍보 레코드 수정 dto */
export class UpdateProductPromotionDto {
  /** 방송홍보 id */
  @IsNumber()
  id: number;

  /** 연결할 상품id (projectLcGoods) */
  @IsNumber()
  @IsOptional()
  goodsId?: number;

  /** 방송인홍보페이지 id */
  @IsNumber()
  @IsOptional()
  broadcasterPromotionPageId?: number;

  /** 방송인 수수료 */
  @IsNumber()
  @IsOptional()
  broadcasterCommissionRate?: number;

  /** 와일트루 수수료 */
  @IsNumber()
  @IsOptional()
  whiletrueCommissionRate?: number;
}
