import { DynamicModule, Module } from '@nestjs/common';
import { GoodsInformationSubjectController } from './goods-information-subject.controller';
import { GoodsInformationSubjectService } from './goods-information-subject.service';

@Module({})
export class GoodsInformationSubjectModule {
  private static readonly providers = [GoodsInformationSubjectService];
  private static readonly exports = [GoodsInformationSubjectService];
  private static readonly controllers = [GoodsInformationSubjectController];

  static withoutControllers(): DynamicModule {
    return {
      module: GoodsInformationSubjectModule,
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: GoodsInformationSubjectModule,
      controllers: this.controllers,
      providers: this.providers,
      exports: this.exports,
    };
  }
}
