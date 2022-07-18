import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Req,
  Res,
} from '@nestjs/common';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { LiveShoppingService } from '@project-lc/nest-modules-liveshopping';
import { OverlayService } from '@project-lc/nest-modules-overlay';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

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
    private readonly configService: ConfigService,
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

  // 오버레이 렌더링 시 필요한 정보들 받아오고, hbs로 넘겨줌
  @Get([':id', '/nsl/:id'])
  async getRender(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ImagesLengthAndUserId> {
    const overlayUrl = id.startsWith('/') ? id : `/${id}`;
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

      const horizontalImagesLength = await this.overlayService.getBannerImagesFromS3(
        { email },
        liveShoppingId.id,
        'horizontal-banner',
      );

      const bucketName = this.configService.get('S3_BUCKET_NAME');

      const data = { verticalImagesLength, email, liveShoppingId, bucketName };

      const nslData = { horizontalImagesLength, email, liveShoppingId, bucketName };

      if (req.path.includes('/nsl')) {
        res.render('nsl-client', nslData);
      } else {
        res.render('client', data);
      }
      return data;
    } catch {
      throw new BadRequestException(`user ${id} not found`);
    }
  }
}
