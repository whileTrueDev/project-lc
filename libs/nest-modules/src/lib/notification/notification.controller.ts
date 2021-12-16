import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserNotification } from '@prisma/client';
import { UserType } from '@project-lc/shared-types';
import {
  CreateMultipleNotificationDto,
  CreateNotificationDto,
  MarkNotificationReadStateDto,
  NotificationService,
} from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // TODO: admin가드 추가
  /** 관리자 -> 특정 유저에게 알림생성 */
  @Post('/admin')
  createNotification(@Body() dto: CreateNotificationDto): Promise<UserNotification> {
    return this.notificationService.createNotification(dto);
  }

  /** 관리자 -> 여러 유저에게 동일한 내용의 알림 생성 */
  @Post('/admin/multiple')
  createMultipleNotification(
    @Body() dto: CreateMultipleNotificationDto,
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
    @Query('take', ParseIntPipe, new DefaultValuePipe(6)) take: number,
  ): Promise<UserNotification[]> {
    return this.notificationService.findNotifications({ userEmail, userType, take });
  }

  /** 특정 알림의 읽음상태 변경 */
  @Patch()
  markNotificationReadState(@Body() dto: MarkNotificationReadStateDto): Promise<boolean> {
    return this.notificationService.markNotificationReadState(dto);
  }
}
