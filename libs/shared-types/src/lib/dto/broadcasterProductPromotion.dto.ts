import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class broadcasterProductPromotionDto {
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

  /** 퍼스트몰 상품 고유번호
   * => ProductPromotion.fmGoodsSeq 는
   * GoodsConfirmation.firstmallGoodsConnectionId 와
   * LiveShopping.fmGoodsSeq 와 중복되면 안됨
   * */
  @IsNumber()
  @IsOptional()
  fmGoodsSeq?: number;

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

  /** 퍼스트몰 상품 id */
  @IsNumber()
  @IsOptional()
  fmGoodsSeq?: number;

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
