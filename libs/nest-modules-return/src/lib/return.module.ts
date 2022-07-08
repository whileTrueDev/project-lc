import { Module, DynamicModule } from '@nestjs/common';
import { CipherModule } from '@project-lc/nest-modules-cipher';
import { ReturnController } from './return.controller';
import { ReturnService } from './return.service';

@Module({})
export class ReturnModule {
  private static readonly providers = [ReturnService];

  private static readonly exports = [ReturnService];

  private static readonly controllers = [ReturnController];

  private static readonly imports = [CipherModule];

  static withoutControllers(): DynamicModule {
    return {
      module: ReturnModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: ReturnModule,
      imports: this.imports,
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
