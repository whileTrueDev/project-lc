import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class broadcasterProductPromotionDto {
  @IsInt() fmGoodsSeq: number;
}

/**  방송홍보 레코드 생성 dto */
export class CreateProductPromotionDto {
  /** 상품홍보페이지 id */
  @IsNumber()
  broadcasterPromotionPageId: number;

  /** project-lc 상품 고유번호 */
  @IsNumber()
  goodsId: number;

  /** 퍼스트몰 상품 고유번호
   * => ProductPromotion.fmGoodsSeq 는
   * GoodsConfirmation.firstmallGoodsConnectionId 와
   * LiveShopping.fmGoodsSeq 와 중복되면 안됨
   * */
  @IsNumber()
  fmGoodsSeq: number;

  @IsNumber()
  @IsOptional()
  broadcasterCommissionRate: number;

  @IsNumber()
  @IsOptional()
  whiletrueCommissionRate: number;
}
