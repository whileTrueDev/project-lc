import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { AdminNotiCountRes, LastCheckedDataRes } from '@project-lc/shared-types';
import { AdminTabAlarmSevice } from './admin-tab-alarm.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/tab-alarm')
export class AdminTabAlarmController {
  constructor(private readonly adminTabAlarmService: AdminTabAlarmSevice) {}

  @Get('/sidebar-noti-counts')
  async getAdminNotiCounts(): Promise<AdminNotiCountRes> {
    return this.adminTabAlarmService.getAdminNotiCounts();
  }

  @Get('/checkedData')
  async getLatestCheckedData(): Promise<LastCheckedDataRes> {
    return this.adminTabAlarmService.getLastCheckedData();
  }

  @Post('/checkedData')
  async updateLatestCheckedData(@Body() dto: Record<string, number>): Promise<boolean> {
    return this.adminTabAlarmService.updateLastCheckedData(dto);
  }
}
