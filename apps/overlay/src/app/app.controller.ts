import { Controller, Get, Render, Param } from '@nestjs/common';
import { OverlayService } from '@project-lc/nest-modules';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly overlayService: OverlayService,
    private readonly appService: AppService,
  ) {}

  @Get()
  healthCheck() {
    return 'alive';
  }

  @Get(':id')
  @Render('client')
  async getRender(@Param('id') id: string) {
    const overlayUrl = `/${id}`;
    const userId = await this.appService.getUserId(overlayUrl);
    const verticalImagesLength = await this.overlayService.getVerticalImagesFromS3(
      userId,
    );
    return { verticalImagesLength, userId };
  }
}
