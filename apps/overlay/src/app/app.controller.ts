import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { OverlayService } from '@project-lc/nest-modules-overlay';
import { BroadcasterEmail } from '@project-lc/shared-types';

interface ImagesLengthAndUserId {
  verticalImagesLength: number;
  email: BroadcasterEmail;
}
@Controller()
export class AppController {
  constructor(
    private readonly overlayService: OverlayService,
    private readonly broadcasterService: BroadcasterService,
  ) {}

  @Get()
  healthCheck(): string {
    return 'alive';
  }

  @Get('/favicon.ico')
  @HttpCode(204)
  ignoreFavicon(): string {
    return 'No-content';
  }

  @Get(':id')
  @Render('client')
  async getRender(@Param('id') id: string): Promise<ImagesLengthAndUserId> {
    const overlayUrl = `/${id}`;
    try {
      const email = await this.broadcasterService.getBroadcasterEmail(overlayUrl);
      const verticalImagesLength = await this.overlayService.getVerticalImagesFromS3(
        email,
      );
      return { verticalImagesLength, email };
    } catch {
      throw new NotFoundException('user not found');
    }
  }
}
