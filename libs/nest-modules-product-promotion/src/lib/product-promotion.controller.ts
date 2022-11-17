import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductPromotion } from '@prisma/client';
import { FindProductPromotionsDto } from '@project-lc/shared-types';
import { ProductPromotionService } from './product-promotion.service';

@Controller('product-promotions')
export class ProductPromotionController {
  constructor(private readonly productPromotionService: ProductPromotionService) {}

  /** goodsId 목록에 연결된 상품홍보 데이터 모두 조회 */
  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) dto: FindProductPromotionsDto,
  ): Promise<ProductPromotion[]> {
    return this.productPromotionService.findProductPromotionsByGoodsIds(dto.goodsIds);
  }
}
