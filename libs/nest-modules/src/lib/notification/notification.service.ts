import { Injectable } from '@nestjs/common';
import { UserNotification } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CreateMultipleNotificationDto,
  CreateNotificationDto,
  FindNotificationsDto,
  MarkNotificationReadStateDto,
} from '@project-lc/shared-types';
import dayjs from 'dayjs';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  /** 특정 유저 1명에 대한 알림 생성 */
  async createNotification(dto: CreateNotificationDto): Promise<UserNotification> {
    const newNoti = await this.prisma.userNotification.create({
      data: dto,
    });

    return newNoti;
  }

  /** 여러 유저에 대한 동일한 내용의 알림 생성 */
  async createMultipleNotification(dto: CreateMultipleNotificationDto): Promise<boolean> {
    const { userEmailList, ...rest } = dto;
    const data = userEmailList.map((userEmail) => ({ userEmail, ...rest }));
    await this.prisma.userNotification.createMany({
      data,
      skipDuplicates: true,
    });
    return true;
  }

  /** 특정 유저의 최근 30일 내 전체 알림 목록 조회 */
  async findNotifications({
    userEmail,
    userType,
  }: FindNotificationsDto): Promise<UserNotification[]> {
    const data = await this.prisma.userNotification.findMany({
      where: {
        userEmail,
        userType,
        createDate: {
          gte: dayjs().subtract(30, 'day').toISOString(),
        },
      },
      orderBy: { createDate: 'desc' },
    });
    return data;
  }

  /** 특정 알림의 읽음상태 변경 */
  async markNotificationReadState({
    id,
  }: MarkNotificationReadStateDto): Promise<boolean> {
    await this.prisma.userNotification.update({
      where: { id },
      data: {
        readFlag: true,
      },
    });
    return true;
  }
}
