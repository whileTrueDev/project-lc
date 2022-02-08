import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserNotification } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import {
  CreateMultipleNotificationDto,
  CreateNotificationDto,
  FindNotificationsDto,
  MarkNotificationReadStateDto,
  UserType,
} from '@project-lc/shared-types';
import { NotificationService } from './notification.service';

@UseGuards(JwtAuthGuard)
@UseInterceptors(HttpCacheInterceptor)
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

  /** 특정 유저의 알림목록 조회(최근 30일 이내의 알람, 생성일 내림차순) */
  @Get()
  findNotifications(
    @Query(new ValidationPipe({ skipMissingProperties: true }))
    dto: FindNotificationsDto,
  ): Promise<UserNotification[]> {
    return this.notificationService.findNotifications(dto);
  }

  /** 특정 유저의 전체 미확인 알림 일괄 읽음으로 변경 */
  @Patch('all')
  readAllUnreadNotification(
    @Body('userEmail') userEmail: string,
    @Body('userType') userType: UserType,
  ): Promise<boolean> {
    return this.notificationService.readAllUnreadNotification({ userEmail, userType });
  }

  /** 특정 알림의 읽음상태 변경 */
  @Patch()
  markNotificationReadState(
    @Body(ValidationPipe) dto: MarkNotificationReadStateDto,
  ): Promise<boolean> {
    return this.notificationService.markNotificationReadState(dto);
  }
}
