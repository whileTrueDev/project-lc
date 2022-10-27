import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { KkshowSubNavLink } from '@prisma/client';
import { CreateKkshowSubNavDto } from '@project-lc/shared-types';
import { KkshowSubNavService } from './kkshow-subnav.service';

@Controller('kkshow-subnav')
export class KkshowSubNavController {
  constructor(private readonly kkshowSubNavService: KkshowSubNavService) {}

  /** 크크쇼 서브네비바 목록 조회 */
  @Get()
  findAll(): Promise<KkshowSubNavLink[]> {
    return this.kkshowSubNavService.findAll();
  }

  /** 크크쇼 서브네비바 데이터 추가 */
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateKkshowSubNavDto,
  ): Promise<KkshowSubNavLink> {
    return this.kkshowSubNavService.add(dto);
  }

  /** 크크쇼 서브네비바 데이터 삭제 */
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.kkshowSubNavService.remove(id);
  }
}
