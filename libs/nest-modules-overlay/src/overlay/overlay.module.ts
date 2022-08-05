import { Module } from '@nestjs/common';
import { BroadcasterModule } from '@project-lc/nest-modules-broadcaster';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { OverlayController } from './overlay.controller';
import { OverlayGateway } from './overlay.gateway';
import { OverlayMessageGateway } from './overlay.message.gateway';
import { OverlayScreenGateway } from './overlay.screen.gateway';
import { OverlayService } from './overlay.service';

@Module({
  imports: [
    LiveShoppingModule.withoutControllers(),
    BroadcasterModule.withoutControllers(),
  ],
  providers: [
    OverlayGateway,
    OverlayScreenGateway,
    OverlayMessageGateway,
    OverlayService,
  ],
  exports: [OverlayService, OverlayGateway, OverlayScreenGateway, OverlayMessageGateway],
  controllers: [OverlayController],
})
export class OverlayModule {}
