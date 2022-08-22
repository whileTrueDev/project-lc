import { BadRequestException, Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BroadcasterService } from '@project-lc/nest-modules-broadcaster';
import { LiveShoppingService } from '@project-lc/nest-modules-liveshopping';
import { PurchaseMessage } from '@project-lc/shared-types';
import { Request, Response } from 'express';
import { OverlayMessageGateway } from './overlay.message.gateway';
import { OverlayService } from './overlay.service';

interface ImagesLengthAndUserId {
  verticalImagesLength: number;
  email: string;
  liveShoppingId: { id: number };
}

@Controller()
export class OverlayController {
  constructor(
    private readonly overlayService: OverlayService,
    private readonly broadcasterService: BroadcasterService,
    private readonly liveShoppingService: LiveShoppingService,
    private readonly configService: ConfigService,
    private readonly overlayMessageGateway: OverlayMessageGateway,
  ) {}

  // 오버레이 렌더링 시 필요한 정보들 받아오고, hbs로 넘겨줌
  @Get([':id', '/nsl/:id'])
  async getRender(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ImagesLengthAndUserId> {
    const overlayUrl = id.startsWith('/') ? id : `/${id}`;
    try {
      const { id: broadcasterIdAndEmailId, email } =
        await this.broadcasterService.getBroadcasterEmail(overlayUrl);
      const liveShoppingId = await this.liveShoppingService.getLiveShoppingForOverlay(
        broadcasterIdAndEmailId,
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

  // API -> 마이크로서비스 -> Overlay 구매메시지 핸들러
  @MessagePattern('liveshopping:overlay:purchase-msg')
  public async handlePurchaseMsg(@Payload() purchase: PurchaseMessage): Promise<void> {
    if (purchase.simpleMessageFlag) {
      return this.overlayService.handleSimplePurchaseMessage(
        purchase,
        this.overlayMessageGateway.server,
      );
    }
    return this.overlayService.handlePurchaseMessage(
      purchase,
      this.overlayMessageGateway.server,
    );
  }
}
