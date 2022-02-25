import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { Seller } from '@prisma/client';
import { S3Service } from '../lib/s3/s3.service';

export type BatchPayload = {
  count: number;
};

@Injectable()
export class AppSellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  private getSellerId(email: string): Promise<{ id: number }> {
    return this.prisma.seller.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

  private copySellerRow(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveSeller 
        (id, email, name, avatar, password, agreementFlag)
      SELECT 
        id, email, name, avatar, password, agreementFlag
      FROM 
        Seller
      WHERE 
        id = ${sellerId};`;
  }

  private copySocialSellerRow(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveSellerSocialAccount 
        (serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, sellerId)
      SELECT 
        serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, sellerId
      FROM 
        SellerSocialAccount
      WHERE 
        sellerId = ${sellerId};`;
  }

  private updateSellerNull(sellerId: number): Promise<Seller> {
    return this.prisma.seller.update({
      where: {
        id: sellerId,
      },
      data: {
        email: null,
        name: null,
        avatar: null,
        password: null,
        inactiveFlag: true,
      },
    });
  }

  private deleteSellerSocialAccountNull(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      Delete FROM
        SellerSocialAccount 
      WHERE 
        sellerId = ${sellerId}`;
  }

  private copySellerBusinessRegistration(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveSellerBusinessRegistration
        (id, 
          sellerEmail, 
          companyName, 
          businessRegistrationNumber, 
          representativeName, 
          businessType, 
          businessItem, 
          businessAddress, 
          taxInvoiceMail, 
          businessRegistrationImageName,
          mailOrderSalesNumber, 
          mailOrderSalesImageName,
          sellerId
          )
      SELECT 
        id, 
        sellerEmail, 
        companyName, 
        businessRegistrationNumber, 
        representativeName, 
        businessType, 
        businessItem, 
        businessAddress, 
        taxInvoiceMail, 
        businessRegistrationImageName, 
        mailOrderSalesNumber, 
        mailOrderSalesImageName,
        sellerId
      FROM 
        SellerBusinessRegistration
      WHERE 
        sellerId = ${sellerId}
    `;
  }

  private copySellerContacts(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveSellerContacts
        (id, sellerId, email, phoneNumber, isDefault, createDate)
      SELECT 
        id, sellerId, email, phoneNumber, isDefault, createDate
      FROM 
        SellerContacts
      WHERE 
        sellerId = ${sellerId}
    `;
  }

  private copySellerSettlementAccount(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveSellerSettlementAccount
        (id, sellerEmail, bank, number, name, settlementAccountImageName, sellerId)
      SELECT 
        id, sellerEmail, bank, number, name, settlementAccountImageName, sellerId
      FROM 
        SellerSettlementAccount
      WHERE 
        sellerId = ${sellerId}
    `;
  }

  private copyBusinessRegistrationConfirmation(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveBusinessRegistrationConfirmation
        (id, STATUS, rejectionReason, InactiveSellerBusinessRegistrationId)
      SELECT 
        brc.id, status, rejectionReason, sellerBusinessRegistrationId
      FROM 
        BusinessRegistrationConfirmation as brc
      JOIN
        SellerBusinessRegistration as sbr
      ON 
        sbr.id = brc.SellerBusinessRegistrationId
      WHERE 
        sbr.sellerId = ${sellerId}
  `;
  }

  private deleteSellerBusinessRegistration(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        SellerBusinessRegistration
      WHERE 
        sellerId=${sellerId}`;
  }

  private deleteSellerContacts(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        SellerContacts 
      WHERE 
        sellerId=${sellerId}`;
  }

  private deleteBusinessRegistrationConfirmation(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE BusinessRegistrationConfirmation FROM 
        BusinessRegistrationConfirmation
      INNER JOIN 
        SellerBusinessRegistration 
      ON 
        SellerBusinessRegistration.id = BusinessRegistrationConfirmation.SellerBusinessRegistrationId 
      WHERE 
        SellerBusinessRegistration.sellerId = ${sellerId}`;
  }

  private deleteSellerSettlementAccount(sellerId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        SellerSettlementAccount 
      WHERE 
        sellerId=${sellerId}`;
  }

  async moveSellerData(userEmail: string): Promise<void> {
    const sellerId = await this.getSellerId(userEmail);

    await Promise.all<void | number | Seller | BatchPayload>([
      await this.copySellerRow(sellerId.id),
      await this.copySocialSellerRow(sellerId.id),
      this.copySellerBusinessRegistration(sellerId.id).then(async () => {
        await this.copyBusinessRegistrationConfirmation(sellerId.id);
        await this.deleteBusinessRegistrationConfirmation(sellerId.id);
        await this.deleteSellerBusinessRegistration(sellerId.id);
      }),
      this.copySellerContacts(sellerId.id).then(() =>
        this.deleteSellerContacts(sellerId.id),
      ),
      this.copySellerSettlementAccount(sellerId.id).then(() =>
        this.deleteSellerSettlementAccount(sellerId.id),
      ),
      this.s3Service.moveObjects('business-registration', userEmail),
      this.s3Service.moveObjects('settlement-account', userEmail),
      this.s3Service.moveObjects('mail-order', userEmail),
    ]);
    await this.deleteSellerSocialAccountNull(sellerId.id);
    await this.updateSellerNull(sellerId.id);
  }
}
