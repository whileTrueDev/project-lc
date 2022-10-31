import { Injectable } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  SellerContactsDTO,
  SellerContactsDTOWithoutIdDTO,
} from '@project-lc/shared-types';

@Injectable()
export class SellerContactsService {
  constructor(private readonly prisma: PrismaService) {}

  /** 판매자의 기본 연락처 조회 */
  async findDefaultContacts(email: string): Promise<SellerContactsDTO> {
    const userId = await this.prisma.seller.findFirst({
      where: { email },
      select: { id: true },
    });

    const sellerDefaultContacts = await this.prisma.sellerContacts.findFirst({
      where: { sellerId: userId.id, isDefault: true },
      select: { id: true, email: true, phoneNumber: true, isDefault: true },
      orderBy: { createDate: 'desc' },
    });

    return sellerDefaultContacts;
  }

  /** 판매자 연락처 등록 */
  async registSellerContacts(
    sellerId: Seller['id'],
    dto: SellerContactsDTOWithoutIdDTO,
  ): Promise<{ contactId: number }> {
    const contact = await this.prisma.sellerContacts.create({
      data: {
        seller: { connect: { id: sellerId } },
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        isDefault: dto.isDefault ? true : undefined,
      },
    });
    return { contactId: contact.id };
  }

  /** 휴면 판매자 연락처 복구 */
  public async restoreSellerContacts(sellerId): Promise<void> {
    const restoreDatas = await this.prisma.inactiveSellerContacts.findMany({
      where: { sellerId },
    });

    if (restoreDatas) {
      Promise.all(
        restoreDatas.map((restoreData) =>
          this.prisma.sellerContacts.create({
            data: restoreData,
          }),
        ),
      );
    }
  }
}
