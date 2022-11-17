import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { KkshowEventPopup } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { KkshowEventPopupService } from './kkshow-event-popup.service';

@Controller('kkshow-event-popup')
export class KkshowEventPopupController {
  constructor(private readonly eventPopupService: KkshowEventPopupService) {}

  /** 크크쇼 이벤트 팝업 목록 조회 */
  @UseInterceptors(HttpCacheInterceptor)
  @Get()
  public getKkshowEventPopupList(): Promise<KkshowEventPopup[]> {
    return this.eventPopupService.getEventPopupList();
  }
}
