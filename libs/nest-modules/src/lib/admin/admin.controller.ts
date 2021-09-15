import { Controller, Get, Query, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private configService: ConfigService,
  ) {}

  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo(@Query('password') password: string) {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    if (adminPassword !== password) {
      return {};
    }
    return this.adminService.getSettlementInfo();
  }
}
