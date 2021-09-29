import { Controller, Get, Render } from '@nestjs/common';
import { OverlayModule, OverlayService } from '@project-lc/nest-modules';
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
    const images = await this.overlayService.getImagesFromS3();
    return '';
  }
}
