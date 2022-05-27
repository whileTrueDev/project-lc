import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { GoodsInformationSubject } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  GoodsInformationSubjectDto,
  GoodsInformationSubjectRes,
} from '@project-lc/shared-types';
import { GoodsInformationSubjectService } from './goods-information-subject.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
@Controller('goods-information-subject')
export class GoodsInformationSubjectController {
  constructor(private readonly goodsInformationService: GoodsInformationSubjectService) {}

  /** 상품정보제공고시 목록 조회 */
  @Get()
  findAll(): Promise<GoodsInformationSubjectRes[]> {
    return this.goodsInformationService.findAll();
  }

  /** 상품제공고시 품목 등록 */
  @Post()
  create(
    @Body(ValidationPipe) dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.goodsInformationService.create(dto);
  }

  /** 상품정보제공고시 품목 개별 조회 */
  @Get(':goodInformationSubjectId')
  findOne(
    @Param('goodInformationSubjectId', ParseIntPipe) id: number,
  ): Promise<GoodsInformationSubjectRes> {
    return this.goodsInformationService.findOne(id);
  }

  /** 상품공고시 품목 수정 */
  @Put(':goodInformationSubjectId')
  update(
    @Param('goodInformationSubjectId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: GoodsInformationSubjectDto,
  ): Promise<GoodsInformationSubject> {
    return this.goodsInformationService.update(id, dto);
  }
}
