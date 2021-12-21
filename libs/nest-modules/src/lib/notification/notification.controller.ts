import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserNotification } from '@prisma/client';
import {
  CreateMultipleNotificationDto,
  CreateNotificationDto,
  MarkNotificationReadStateDto,
  UserType,
} from '@project-lc/shared-types';
import { AdminGuard } from '../_nest-units/guards/admin.guard';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /** 관리자 -> 특정 유저에게 알림생성 */
  @UseGuards(AdminGuard)
  @Post('/admin')
  createNotification(
    @Body(ValidationPipe) dto: CreateNotificationDto,
  ): Promise<UserNotification> {
    return this.notificationService.createNotification(dto);
  }

  /** 관리자 -> 여러 유저에게 동일한 내용의 알림 생성 */
  @UseGuards(AdminGuard)
  @Post('/admin/multiple')
  createMultipleNotification(
    @Body(ValidationPipe) dto: CreateMultipleNotificationDto,
  ): Promise<boolean> {
    return this.notificationService.createMultipleNotification(dto);
  }

  /** 특정 유저의 알림목록 조회(생성일 내림차순)
   * @query userEmail 타겟 유저의 이메일
   * @query userType 'seller' | 'broadcaster'
   * @query take? 기본 6개, 몇개 조회할건지
   */
  @Get()
  findNotifications(
    @Query('userEmail') userEmail: string,
    @Query('userType') userType: UserType,
    @Query('take', new DefaultValuePipe(6), ParseIntPipe) take: number,
  ): Promise<UserNotification[]> {
    return this.notificationService.findNotifications({ userEmail, userType, take });
  }

  /** 특정 알림의 읽음상태 변경 */
  @Patch()
  markNotificationReadState(
    @Body(ValidationPipe) dto: MarkNotificationReadStateDto,
  ): Promise<boolean> {
    return this.notificationService.markNotificationReadState(dto);
  }
}
