import { Module, DynamicModule } from '@nestjs/common';
import { MileageController } from './mileage.controller';
import { MileageService } from './mileage.service';
import { MileageLogService } from './mileage-log.service';
import { MileageSettingService } from './mileage-setting/mileage-setting.service';
import { MileageSettingController } from './mileage-setting/mileage-setting.controller';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
@Module({})
export class MileageModule {
  private static readonly providers = [
    MileageService,
    MileageLogService,
    MileageSettingService,
  ];

  private static readonly exports = [
    MileageService,
    MileageLogService,
    MileageSettingService,
  ];

  private static readonly controllers = [MileageController, MileageSettingController];

  static withoutControllers(): DynamicModule {
    return {
      module: MileageModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
    };
  }

  static withControllers(): DynamicModule {
    return {
      module: MileageModule,
      imports: [],
      providers: this.providers,
      exports: this.exports,
      controllers: this.controllers,
    };
  }
}
