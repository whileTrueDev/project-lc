import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { KkshowEventPopup } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { KkshowEventPopupService } from './kkshow-event-popup.service';

@Controller('kkshow-event-popup')
export class KkshowEventPopupController {
  constructor(private readonly eventPopupService: KkshowEventPopupService) {}

  @UseInterceptors(HttpCacheInterceptor)
  @Get()
  public getKkshowBcList(): Promise<KkshowEventPopup[]> {
    return this.eventPopupService.getEventPopupList();
  }
}
