import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  GoodsInformationNoticeDto,
  GoodsInformationSubjectDto,
} from '@project-lc/shared-types';
import { GoodsInformationNotice, GoodsInformationSubject } from '@prisma/client';
import { GoodsInformationService } from './goods-information.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('goods-information')
export class GoodsInformationController {
  constructor(private readonly goodsInformationService: GoodsInformationService) {}

  @Get('/goods-information-subject')
  findGoodsInformationSubjetct(
    @Query('goodInformationSubjectId', ValidationPipe)
    dto: {
      goodInformationSubjectId: number;
    },
  ): Promise<GoodsInformationSubject> {
    return this.goodsInformationService.findGoodsInformationSubject(
      dto.goodInformationSubjectId,
    );
  }

  /** 상품제공고시 품목 등록 */
  @Post('/goods-information-subject')
  registGoodsInformationSubject(
    @Body(ValidationPipe) dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.goodsInformationService.registGoodsInformationSubject(dto);
  }

  /** 상품제공고시 수정 */
  @Put('/goods-information-notice')
  updateGoodsInformationNotice(
    @Body(ValidationPipe) dto: GoodsInformationNoticeDto,
  ): Promise<GoodsInformationNotice> {
    return this.goodsInformationService.updateGoodsInformationNotice(dto);
  }

  /** 상품공고시 품목 수정 */
  @Put('/goods-information-subject')
  updateGoodsInformationSubject(
    @Body(ValidationPipe) dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.goodsInformationService.updateGoodsInformationSubject(dto);
  }
}
