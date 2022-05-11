import { Module, DynamicModule } from '@nestjs/common';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';

@Module({})
export class ExchangeModule {
  private static readonly providers = [ExchangeService];

  private static readonly exports = [ExchangeService];

  private static readonly controllers = [ExchangeController];

  static withoutControllers(): DynamicModule {
    return {
      module: ExchangeModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ExchangeModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
