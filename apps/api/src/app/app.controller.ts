import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { FMGoodsService } from '@project-lc/firstmall-db';
import { Prisma } from '@prisma/client';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firstmallGoods: FMGoodsService,
  ) {}

  @Get()
  getData() {
    return this.firstmallGoods.findAll();
  }

  @Get('users')
  async getUsers() {
    const result = await this.appService.getUserData({ id: 1 });
    return result;
  }

  @Get('notifications')
  async getNotifications() {
    return this.appService.findNotification();
  }

  @Post('users')
  async createUser(@Body() body: Prisma.UserCreateInput) {
    return this.appService.createUser(body);
  }

  @Delete('users')
  signOut(@Query('id') id: number, @Query('email') email: string) {
    return this.appService.deleteUser({ id, email });
  }
}
