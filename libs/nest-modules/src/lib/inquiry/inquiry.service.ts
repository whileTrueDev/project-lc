import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { InquiryDtoWithoutReadFlag } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getInquries(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      orderBy: [
        {
          readFlag: 'asc',
        },
        {
          createDate: 'desc',
        },
      ],
    });
  }
}
