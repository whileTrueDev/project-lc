import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductPromotion } from '@prisma/client';
import { FindProductPromotionsDto } from '@project-lc/shared-types';
import { ProductPromotionService } from './product-promotion.service';

@Controller('product-promotions')
export class ProductPromotionController {
  constructor(private readonly productPromotionService: ProductPromotionService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) dto: FindProductPromotionsDto,
  ): Promise<ProductPromotion[]> {
    return this.productPromotionService.findProductPromotionsByGoodsIds(dto.goodsIds);
  }
}
