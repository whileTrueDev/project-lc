import {
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Render,
} from '@nestjs/common';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { LiveShoppingService } from '@project-lc/nest-modules-liveshopping';
import { OverlayService } from '@project-lc/nest-modules-overlay';

interface ImagesLengthAndUserId {
  verticalImagesLength: number;
  email: string;
  liveShoppingId: { id: number };
}
@Controller()
export class AppController {
  constructor(
    private readonly overlayService: OverlayService,
    private readonly broadcasterService: BroadcasterService,
    private readonly liveShoppingService: LiveShoppingService,
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
      const broadcasterIdAndEmail = await this.broadcasterService.getBroadcasterEmail(
        overlayUrl,
      );

      const { email } = broadcasterIdAndEmail;

      const liveShoppingId = await this.liveShoppingService.getLiveShoppingForOverlay(
        broadcasterIdAndEmail.id,
      );

      const verticalImagesLength = await this.overlayService.getBannerImagesFromS3(
        { email },
        liveShoppingId.id,
        'vertical-banner',
      );

      return { verticalImagesLength, email, liveShoppingId };
    } catch {
      throw new NotFoundException('user not found');
    }
  }

  @Get('/nsl/:id')
  @Render('nsl-client')
  async renderNaverShoppingLive(@Param('id') id: string): Promise<ImagesLengthAndUserId> {
    const overlayUrl = `/${id}`;
    try {
      const broadcasterIdAndEmail = await this.broadcasterService.getBroadcasterEmail(
        overlayUrl,
      );

      const { email } = broadcasterIdAndEmail;

      const liveShoppingId = await this.liveShoppingService.getLiveShoppingForOverlay(
        broadcasterIdAndEmail.id,
      );

      const verticalImagesLength = await this.overlayService.getBannerImagesFromS3(
        { email },
        liveShoppingId.id,
        'horizontal-banner',
      );

      return { verticalImagesLength, email, liveShoppingId };
    } catch {
      throw new NotFoundException('user not found');
    }
  }
}
