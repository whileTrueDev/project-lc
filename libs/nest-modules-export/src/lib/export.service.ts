import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { ExportCreateRes, ExportListRes, ExportRes } from '@project-lc/shared-types';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  /** 합포장 출고처리 */
  public async exportBundle(): Promise<boolean> {
    console.log('합포장 출고처리');
    return true;
  }

  /** 일괄 출고처리 */
  public async exportMany(): Promise<boolean> {
    console.log('일괄출고처리');
    return true;
  }

  /** 단일 출고처리 */
  public async exportOne(): Promise<ExportCreateRes> {
    console.log('단일 출고처리');
    return { orderId: 0, orderCode: ' 주문코드??', exportCode: '출고코드' };
  }

  /** 개별출고정보 조회 */
  public async getExportDetail(exportCode: string): Promise<ExportRes> {
    console.log(`개별출고정보 조회 exportCode:${exportCode}`);
    return {} as ExportRes;
  }

  /** 출고목록조회 - 판매자, 관리자 용 */
  public async getExportList(): Promise<ExportListRes> {
    console.log('출고목록조회 - 판매자, 관리자 용');
    return [];
  }
}
