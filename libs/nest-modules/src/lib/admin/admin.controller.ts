import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/settlement')
  getSettlementInfo() {
    // admin 페이지 광고주 정산 정보
    return this.adminService.getSettlementInfo();
  }
}
