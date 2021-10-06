import {
  Controller,
  Get,
  Render,
  Param,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { OverlayService } from '@project-lc/nest-modules';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly overlayService: OverlayService,
    private readonly appService: AppService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'alive';
  }

  @Get('/favicon.ico')
  @HttpCode(204)
  ignoreFavicon() {
    return 'No-content';
  }

  @Get(':id')
  @Render('client')

  async getRender(@Param('id') id: string) {
    const overlayUrl = `/${id}`;
    try {
      const userId = await this.appService.getUserId(overlayUrl);
      const verticalImagesLength = await this.overlayService.getVerticalImagesFromS3(
        userId,
      );
      return { verticalImagesLength, userId };
    } catch {
      throw new NotFoundException('user not found');
    }
  }
}
