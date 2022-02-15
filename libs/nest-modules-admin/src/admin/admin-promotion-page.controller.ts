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
import { BroadcasterPromotionPage } from '@prisma/client';
import { JwtAuthGuard, AdminGuard } from '@project-lc/nest-modules-authguard';
import { BroadcasterPromotionPageService } from '@project-lc/nest-modules-broadcaster';
import {
  BroadcasterPromotionPageDto,
  BroadcasterPromotionPageUpdateDto,
  BroadcasterPromotionPageListRes,
} from '@project-lc/shared-types';

/** ================================= */
// 방송인 상품홍보페이지 BroadcasterPromotionPage
/** ================================= */
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/promotion-page')
export class AdminPromotionPageController {
  constructor(
    private readonly broadcasterPromotionPageService: BroadcasterPromotionPageService,
  ) {}

  /** 방송인 상품홍보페이지 생성 */
  @Post()
  async createPromotionPage(
    @Body(ValidationPipe) dto: BroadcasterPromotionPageDto,
  ): Promise<BroadcasterPromotionPage> {
    return this.broadcasterPromotionPageService.createPromotionPage(dto);
  }

  /** 상품홍보페이지 수정 */
  @Patch()
  async updatePromotionPage(
    @Body(ValidationPipe) dto: BroadcasterPromotionPageUpdateDto,
  ): Promise<BroadcasterPromotionPage> {
    return this.broadcasterPromotionPageService.updatePromotionPage(dto);
  }

  /** 방송인 상품홍보페이지 url 중복 확인
   * @query url
   * @return 중복 url이면 true, 중복이 아니면 false
   */
  @Get('/duplicate')
  async checkPromotionPageUrlDuplicate(@Query('url') url: string): Promise<boolean> {
    return this.broadcasterPromotionPageService.checkPromotionPageUrlDuplicate(url);
  }

  /**
   * 방송인 상품홍보페이지 삭제
   * @param pageId 방송인 상품홍보페이지 id
   * @returns 삭제 성공시 true
   */
  @Delete()
  async deletePromotionPage(
    @Body('pageId', ParseIntPipe) pageId: number,
  ): Promise<boolean> {
    return this.broadcasterPromotionPageService.deletePromotionPage(pageId);
  }

  /** 상품홍보페이지 목록 조회 */
  @Get('list')
  async getBroadcasterPromotionPageList(): Promise<BroadcasterPromotionPageListRes> {
    return this.broadcasterPromotionPageService.getBroadcasterPromotionPageList();
  }
}
