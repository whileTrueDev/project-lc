import { Injectable } from '@nestjs/common';
import { KkshowEventPopup } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CreateEventPopupDto, UpdateEventPopupDto } from '@project-lc/shared-types';

@Injectable()
export class KkshowEventPopupService {
  constructor(private readonly prisma: PrismaService) {}

  /** 이벤트팝업 추가 */
  public async createEventPopup(dto: CreateEventPopupDto): Promise<KkshowEventPopup> {
    const { imageWidth: width, imageHeight: height, ...rest } = dto;
    return this.prisma.kkshowEventPopup.create({
      data: {
        ...rest,
        width,
        height,
      },
    });
  }

  /** 이벤트팝업 변경 */
  public async updateEventPopup({
    id,
    dto,
  }: {
    id: number;
    dto: UpdateEventPopupDto;
  }): Promise<boolean> {
    const existEventPopup = await this.prisma.kkshowEventPopup.findUnique({
      where: { id },
    });

    if (existEventPopup) {
      await this.prisma.kkshowEventPopup.update({
        where: { id },
        data: {
          ...dto,
        },
      });
    }

    return true;
  }

  /** 이벤트팝업 삭제 */
  public async deleteEventPopup(id: number): Promise<boolean> {
    await this.prisma.kkshowEventPopup.delete({
      where: { id },
    });
    return true;
  }

  /** 이벤트팝업 목록조회 */
  public async getEventPopupList(): Promise<KkshowEventPopup[]> {
    return this.prisma.kkshowEventPopup.findMany({
      orderBy: [{ priority: 'asc' }, { createDate: 'desc' }],
    });
  }
}
