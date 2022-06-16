import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ProductPromotion } from '@prisma/client';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { ProductPromotionService } from '@project-lc/nest-modules-product-promotion';
import {
  CreateProductPromotionDto,
  UpdateProductPromotionDto,
  ProductPromotionListData,
} from '@project-lc/shared-types';
import { AdminService } from './admin.service';

/** ================================= */
// 상품홍보 ProductPromotion
/** ================================= */
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/product-promotion')
export class AdminProductPromotionController {
  constructor(
    private readonly productPromotionService: ProductPromotionService,
    private readonly adminService: AdminService,
  ) {}

  /** 상품홍보 생성(특정 상품홍보 페이지에 상품홍보 등록) */
  @Post()
  async createProductPromotion(
    @Body(ValidationPipe) dto: CreateProductPromotionDto,
  ): Promise<ProductPromotion> {
    return this.productPromotionService.createProductPromotion(dto);
  }

  /** 상품홍보 수정 */
  @Patch()
  async updateProductPromotion(
    @Body(ValidationPipe) dto: UpdateProductPromotionDto,
  ): Promise<ProductPromotion> {
    return this.productPromotionService.updateProductPromotion(dto);
  }

  /** 상품홍보 삭제 */
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete()
  async deleteProductPromotion(
    @Body('promotionId', ParseIntPipe) promotionId: number,
  ): Promise<boolean> {
    return this.productPromotionService.deleteProductPromotion(promotionId);
  }

  /** 특정 방송인홍보페이지에 등록된 상품홍보목록 조회 */
  @Get('list')
  async findProductPromotionListByPromotionPageId(
    @Query('promotionPageId', ParseIntPipe) promotionPageId: number,
  ): Promise<ProductPromotionListData> {
    return this.productPromotionService.findProductPromotionListByPromotionPageId(
      promotionPageId,
    );
  }
}
