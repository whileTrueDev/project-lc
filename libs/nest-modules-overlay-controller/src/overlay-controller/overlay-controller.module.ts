import { Module } from '@nestjs/common';
import { OverlayControllerService } from './overlay-controller.service';

@Module({
  providers: [OverlayControllerService],
  exports: [OverlayControllerService],
})
export class OverlayControllerModule {}
