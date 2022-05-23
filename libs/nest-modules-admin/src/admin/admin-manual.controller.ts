import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Manual } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { ManualService } from '@project-lc/nest-modules-manual';
import {
  AdminManualListRes,
  EditManualDto,
  PostManualDto,
} from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('manual')
@Controller('admin/manual')
export class AdminManualController {
  constructor(private readonly manualService: ManualService) {}

  /** 이용안내 생성 */
  @Post()
  createManual(@Body(ValidationPipe) dto: PostManualDto): Promise<Manual> {
    return this.manualService.createManual(dto);
  }

  /** 이용안내 목록 조회 */
  @Get('list')
  async getManualList(): Promise<AdminManualListRes> {
    return this.manualService.getManualList();
  }

  /** 이용안내 수정 */
  @Patch(':id')
  updateOneManual(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: EditManualDto,
  ): Promise<boolean> {
    return this.manualService.updateOneManual(id, dto);
  }

  /** 이용안내 삭제 */
  @Delete(':id')
  deleteOneManual(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.manualService.deleteOneManual(id);
  }
}
