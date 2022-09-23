import { Module, DynamicModule } from '@nestjs/common';
import { KkshowEventPopupController } from './kkshow-event-popup.controller';
import { KkshowEventPopupService } from './kkshow-event-popup.service';

@Module({})
export class KkshowEventPopupModule {
  private static readonly providers = [KkshowEventPopupService];
  private static readonly controllers = [KkshowEventPopupController];

  private static readonly imports = [];
  private static readonly exports = [KkshowEventPopupService];

  static withoutControllers(): DynamicModule {
    return {
      module: KkshowEventPopupModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: KkshowEventPopupModule,
      imports: this.imports,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
