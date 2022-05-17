import { Module, DynamicModule } from '@nestjs/common';
import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';

@Module({})
export class ReturnModule {
  private static readonly providers = [ReturnService];

  private static readonly exports = [ReturnService];

  private static readonly controllers = [ReturnController];

  static withoutControllers(): DynamicModule {
    return {
      module: ReturnModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ReturnModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
