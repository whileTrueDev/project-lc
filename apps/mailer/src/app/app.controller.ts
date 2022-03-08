import { Controller, Get, Post, Body } from '@nestjs/common';
import { TargetUser } from '@project-lc/shared-types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  healthCheck(): string {
    return 'alive';
  }

  @Post('/inactive-pre')
  sendPreInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.appService.sendPreInactivateMail(user);
  }

  @Post('/inactive')
  sendInactiveMail(@Body() user: TargetUser[]): Promise<boolean> {
    return this.appService.sendInactivateMail(user);
  }
}
