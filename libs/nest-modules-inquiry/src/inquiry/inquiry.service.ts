import { Injectable } from '@nestjs/common';
import { Inquiry } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { InquiryDtoWithoutReadFlag } from '@project-lc/shared-types';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  /** 일반문의 생성 */
  async registInquiry(dto: InquiryDtoWithoutReadFlag): Promise<boolean> {
    await this.prisma.inquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        content: dto.content,
        phoneNumber: dto.phoneNumber || undefined,
        brandName: dto.brandName || undefined,
        homepage: dto.homepage || undefined,
        type: dto.type,
        readFlag: false,
      },
    });
    return true;
  }

  /** 일반문의 전체 조회 */
  async getInquries(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      orderBy: [{ readFlag: 'asc' }, { createDate: 'desc' }],
    });
  }

  /** 일반문의 읽음여부 = 읽음 으로 변경 */
  async updateReadFlag(id: { inquiryId: number }): Promise<boolean> {
    await this.prisma.inquiry.update({
      where: { id: id.inquiryId },
      data: { readFlag: true },
    });
    return true;
  }
}
