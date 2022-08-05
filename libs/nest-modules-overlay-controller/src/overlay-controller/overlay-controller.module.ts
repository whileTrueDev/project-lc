import { Module } from '@nestjs/common';
import { LiveShoppingModule } from '@project-lc/nest-modules-liveshopping';
import { OverlayControllerService } from './overlay-controller.service';

@Module({
  imports: [LiveShoppingModule.withoutControllers()],
  providers: [OverlayControllerService],
  exports: [OverlayControllerService],
})
export class OverlayControllerModule {}
