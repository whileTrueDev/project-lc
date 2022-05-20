import { Body, Controller, Get, Param, Post, ValidationPipe } from '@nestjs/common';
import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import {
  CreateKkshowExportDto,
  ExportCreateRes,
  ExportListRes,
  ExportManyDto,
  ExportRes,
} from '@project-lc/shared-types';
import { ExportService } from './export.service';

// @UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /** 합포장 출고처리 -> 일괄출고처리와 비슷하나 출고에 합포장코드가 추가되고, 연결된 주문에 합포장플래그 true 설정 */
  @Post('bundle')
  public exportBundle(
    @Body(ValidationPipe) dto: ExportManyDto,
    // @SellerInfo() seller: UserPayload,
  ): Promise<boolean> {
    return this.exportService.exportBundle(dto);
  }

  /** 일괄 출고처리 */
  @Post('many')
  public exportMany(
    @Body(ValidationPipe) dto: ExportManyDto,
    // @SellerInfo() seller: UserPayload,
  ): Promise<boolean> {
    return this.exportService.exportMany(dto);
  }

  /** 단일 출고처리 */
  @Post()
  public exportOne(
    @Body(ValidationPipe) dto: CreateKkshowExportDto,
    // @SellerInfo() seller: UserPayload,
  ): Promise<ExportCreateRes> {
    return this.exportService.exportOne({ dto });
  }

  /** 개별출고정보 조회 */
  @Get(':exportCode')
  public getExportDetail(@Param('exportCode') exportCode: string): Promise<ExportRes> {
    return this.exportService.getExportDetail(exportCode);
  }

  /** 출고목록조회 - 판매자, 관리자 용 */
  @Get()
  public getExportList(): Promise<ExportListRes> {
    return this.exportService.getExportList();
  }
}
