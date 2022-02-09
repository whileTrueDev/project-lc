import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { InquiryDtoWithoutReadFlag } from '@project-lc/shared-types';
import { Inquiry } from '@prisma/client';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';

@Injectable()
export class InquiryService extends ServiceBaseWithCache {
  #INQUIRY_CACHE_KEY = 'inquiry';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

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
    await this._clearCaches(this.#INQUIRY_CACHE_KEY);
    return true;
  }

  async getInquries(): Promise<Inquiry[]> {
    return this.prisma.inquiry.findMany({
      orderBy: [{ readFlag: 'asc' }, { createDate: 'desc' }],
    });
  }

  async updateReadFlag(id: { inquiryId: number }): Promise<boolean> {
    await this.prisma.inquiry.update({
      where: { id: id.inquiryId },
      data: { readFlag: true },
    });
    await this._clearCaches(this.#INQUIRY_CACHE_KEY);
    return true;
  }
}
