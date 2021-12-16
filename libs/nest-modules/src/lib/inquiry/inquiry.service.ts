import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { InquiryDTO } from '@project-lc/shared-types';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}

  async registInquiry(dto: InquiryDTO): Promise<boolean> {
    await this.prisma.inquiry.create({
      data: {
        name: dto.name,
        email: dto.email,
        phoneNumber: dto.phoneNumber || undefined,
        brandName: dto.brandName || undefined,
        homepage: dto.homepage || undefined,
        type: dto.type,
        readFlag: false,
      },
    });
    return true;
  }
}
