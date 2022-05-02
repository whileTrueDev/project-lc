import { DynamicModule, Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';

@Module({})
export class PolicyModule {
  private static readonly providers = [PolicyService];

  private static readonly exports = [PolicyService];

  private static readonly controllers = [PolicyController];

  static withoutControllers(): DynamicModule {
    return {
      module: PolicyModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: PolicyModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
