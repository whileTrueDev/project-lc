import { Controller, Get, Render } from '@nestjs/common';

import { OverlayControllerService } from '@project-lc/nest-modules';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly overlayControllerService: OverlayControllerService,
  ) {}

  @Get()
  @Render('index')
  async renterTest() {
    const urlAndNicknames = await this.overlayControllerService.getCreatorUrls();
    return { urlAndNicknames };
  }
}
