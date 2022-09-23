import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class KkshowEventPopupService {
  constructor(private readonly prisma: PrismaService) {}

  /** 이벤트팝업 추가 */
  public async createEventPopup(dto: any): Promise<any> {
    // const newEventPopup = await this.prisma.kkshowEventPopup.create({
    //   data: {

    //   }
    // })
    return 'create';
  }

  /** 이벤트팝업 변경 */
  public async updateEventPopup({ id, dto }: { id: number; dto: any }): Promise<any> {
    return 'update';
  }

  /** 이벤트팝업 삭제 */
  public async deleteEventPopup(id: number): Promise<any> {
    return this.prisma.kkshowEventPopup.delete({
      where: { id },
    });
  }

  /** 이벤트팝업 목록조회 */
  public async getEventPopupList(): Promise<any> {
    return this.prisma.kkshowEventPopup.findMany({
      orderBy: [{ priority: 'asc' }, { createDate: 'desc' }],
    });
  }
}
