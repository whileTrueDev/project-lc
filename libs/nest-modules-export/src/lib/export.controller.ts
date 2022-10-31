import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
// import { SellerInfo, UserPayload } from '@project-lc/nest-core';
import {
  CreateKkshowExportDto,
  ExportCreateRes,
  ExportListRes,
  ExportManyDto,
  ExportRes,
  FindExportListDto,
} from '@project-lc/shared-types';
import { ExportService } from './export.service';

@UseGuards(JwtAuthGuard)
@Controller('export')
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('order', 'export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  /** 합포장 출고처리 -> 일괄출고처리와 비슷하나 출고에 합포장코드가 추가되고, 연결된 주문에 합포장플래그 true 설정 */
  @Post('bundle')
  public exportBundle(@Body(ValidationPipe) dto: ExportManyDto): Promise<boolean> {
    return this.exportService.exportBundle({
      exportOrders: dto.exportOrders,
    });
  }

  /** 일괄 출고처리 */
  @Post('many')
  public exportMany(@Body(ValidationPipe) dto: ExportManyDto): Promise<boolean> {
    return this.exportService.exportMany({
      exportOrders: dto.exportOrders,
    });
  }

  /** 단일 출고처리 */
  @Post()
  public exportOne(
    @Body(ValidationPipe) dto: CreateKkshowExportDto,
  ): Promise<ExportCreateRes> {
    return this.exportService.exportOne({ dto: { ...dto } });
  }

  /** 개별출고정보 조회 */
  @Get(':exportCode')
  public getExportDetail(@Param('exportCode') exportCode: string): Promise<ExportRes> {
    return this.exportService.getExportDetail(exportCode);
  }

  /** 출고목록조회 - 판매자, 관리자 용
   * dto.sellerId 값이 있으면, 해당 판매자의 상품이 포함된 출고정보만 조회합니다
   */
  @Get()
  public getExportList(
    @Query(new ValidationPipe({ transform: true })) dto: FindExportListDto,
  ): Promise<ExportListRes> {
    return this.exportService.getExportList(dto);
  }
}
