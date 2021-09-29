import { Controller, Get, Render } from '@nestjs/common';
import { OverlayService } from '@project-lc/nest-modules';
@Controller()
export class AppController {
  constructor(private readonly overlayService: OverlayService) {}

  @Get()
  healthCheck() {
    return 'alive';
  }

  @Get(':id')
  @Render('client')
  async getRender() {
    const verticalImages = await this.overlayService.getVerticalImagesFromS3();
    return { images: verticalImages };
  }
}
