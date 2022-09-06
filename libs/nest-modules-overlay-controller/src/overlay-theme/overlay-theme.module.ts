import { DynamicModule, Module } from '@nestjs/common';
import { OverlayThemeService } from './overlay-theme.service';

@Module({})
export class OverlayThemeModule {
  private static imports = [];
  private static providers = [OverlayThemeService];

  private static controllers = [];
  private static exports = [OverlayThemeService];

  static withoutControllers(): DynamicModule {
    return {
      module: OverlayThemeModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: OverlayThemeModule,
      controllers: this.controllers,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
