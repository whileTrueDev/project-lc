import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Get('/settlement')
  @Header('Cache-Control', 'no-cache, no-store, must-revalidate')
  getSettlementInfo() {
    return this.adminService.getSettlementInfo();
  }
}
