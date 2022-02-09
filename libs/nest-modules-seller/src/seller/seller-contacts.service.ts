import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { SellerContactsDTO } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class SellerContactsService extends ServiceBaseWithCache {
  #SELLER_CONTACTS_CACHE_KEY = 'seller/contacts';

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 판매자의 기본 연락처 */
  async findDefaultContacts(email: string): Promise<SellerContactsDTO> {
    const userId = await this.prisma.seller.findFirst({
      where: { email },
      select: {
        id: true,
      },
    });

    const sellerDefaultContacts = await this.prisma.sellerContacts.findFirst({
      where: { sellerId: userId.id, isDefault: true },
      select: { id: true, email: true, phoneNumber: true, isDefault: true },
      orderBy: { createDate: 'desc' },
    });

    return sellerDefaultContacts;
  }

  /** 판매자 연락처 등록 */
  async registSellerContacts(sellerEmail, dto): Promise<{ contactId: number }> {
    const contact = await this.prisma.sellerContacts.create({
      data: {
        seller: { connect: { email: sellerEmail } },
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        isDefault: dto.isDefault ? true : undefined,
      },
    });
    await this._clearCaches(this.#SELLER_CONTACTS_CACHE_KEY);
    return { contactId: contact.id };
  }
}
