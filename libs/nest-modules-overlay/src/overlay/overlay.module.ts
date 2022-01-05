import { Module } from '@nestjs/common';
import { OverlayService } from './overlay.service';

@Module({
  providers: [OverlayService],
  exports: [OverlayService],
})
export class OverlayModule {}
