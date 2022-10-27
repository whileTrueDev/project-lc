import { Controller, Get, Put, UseGuards, Body } from '@nestjs/common';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { AdminNotiCountRes, LastCheckedDataRes } from '@project-lc/shared-types';
import { AdminTabAlarmSevice } from './admin-tab-alarm.service';

/** 관리자 정산정보 검수, 정산 페이지 등에 존재하는 '알림초기화' 기능 & 관리자페이지 사이드바 새로운데이터 개수 조회용
 */
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/tab-alarm')
export class AdminTabAlarmController {
  constructor(private readonly adminTabAlarmService: AdminTabAlarmSevice) {}

  /** 관리자페이지 사이드바 탭별 신규 데이터 개수 조회 */
  @Get('/sidebar-noti-counts')
  async getAdminNotiCounts(): Promise<AdminNotiCountRes> {
    return this.adminTabAlarmService.getAdminNotiCounts();
  }

  /** 관리자가 마지막으로 확인한 데이터 고유번호 조회 */
  @Get('/checkedData')
  async getLastCheckedData(): Promise<LastCheckedDataRes> {
    return this.adminTabAlarmService.getLastCheckedData();
  }

  /** 관리자가 마지막으로 확인한 데이터 고유번호 저장 */
  @Put('/checkedData')
  async updateLastCheckedData(@Body() dto: Record<string, number>): Promise<boolean> {
    return this.adminTabAlarmService.updateLastCheckedData(dto);
  }
}
