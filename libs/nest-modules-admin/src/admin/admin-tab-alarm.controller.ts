import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { AdminNotiCountRes } from '@project-lc/shared-types';
import { AdminTabAlarmSevice } from './admin-tab-alarm.service';

/** ================================= */
// 상품홍보 ProductPromotion
/** ================================= */
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/tab-alarm')
export class AdminTabAlarmController {
  constructor(private readonly adminTabAlarmService: AdminTabAlarmSevice) {}

  @Get('/sidebar-noti-counts')
  async getAdminNotiCounts(): Promise<AdminNotiCountRes> {
    return this.adminTabAlarmService.getAdminNotiCounts();
  }
}
