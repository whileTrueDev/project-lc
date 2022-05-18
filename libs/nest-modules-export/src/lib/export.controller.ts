import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import { CreateKkshowExportDto, ExportManyDto } from '@project-lc/shared-types';

// @UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  // constructor() {}

  /** 합포장 출고처리 */
  @Post('bundle')
  public exportBundledOrders(
    @Body(ValidationPipe) dto: ExportManyDto,
    // @SellerInfo() seller: UserPayload,
  ): any {
    return '합포장 출고처리';
  }

  /** 일괄 출고처리 */
  @Post('many')
  public exportOrders(
    @Body(ValidationPipe) dto: ExportManyDto,
    // @SellerInfo() seller: UserPayload,
  ): any {
    return '일괄출고처리';
  }

  /** 단일 출고처리 */
  @Post()
  public exportOrder(
    @Body(ValidationPipe) dto: CreateKkshowExportDto,
    // @SellerInfo() seller: UserPayload,
  ): any {
    return '단일 출고처리';
  }

  /** 개별출고정보 조회 */
  @Get(':exportCode')
  getExportDetail(@Param('exportCode') exportCode: string): any {
    return `개별출고정보 조회 exportCode:${exportCode}`;
  }

  /** 출고목록조회 - 판매자, 관리자 용 */
  @Get()
  getExportList(): any {
    return '출고목록조회 - 판매자, 관리자 용';
  }
}
