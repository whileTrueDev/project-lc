import { Controller, Get } from '@nestjs/common';
import { KkshowMainResData } from '@project-lc/shared-types';
import { KkshowMainService } from './kkshow-main.service';

@Controller('kkshow-main')
export class KkshowMainController {
  constructor(private readonly kkshowMainService: KkshowMainService) {}

  /** 크크쇼 메인에 표시될 데이터 조회 */
  @Get()
  getKkshowMainData(): Promise<KkshowMainResData | null> {
    return this.kkshowMainService.read();
  }
}
