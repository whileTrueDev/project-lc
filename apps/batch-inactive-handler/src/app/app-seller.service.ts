import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import { Seller } from '@prisma/client';
import { s3 } from '@project-lc/utils-s3';

export type BatchPayload = {
  count: number;
};

@Injectable()
export class AppSellerService {
  constructor(private readonly prisma: PrismaService) {}

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
          sellerId,
          companyName, 
          businessRegistrationNumber, 
          representativeName, 
          businessType, 
          businessItem, 
          businessAddress, 
          taxInvoiceMail, 
          businessRegistrationImageName,
          mailOrderSalesNumber, 
          mailOrderSalesImageName
          )
      SELECT 
        id,
        sellerId,
        companyName, 
        businessRegistrationNumber, 
        representativeName, 
        businessType, 
        businessItem, 
        businessAddress, 
        taxInvoiceMail, 
        businessRegistrationImageName, 
        mailOrderSalesNumber, 
        mailOrderSalesImageName        
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
        (id, sellerId, bank, number, name, settlementAccountImageName)
      SELECT 
        id, sellerId, bank, number, name, settlementAccountImageName 
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
      s3.moveObjects(
        'business-registration',
        'inactive-business-registration',
        userEmail,
      ),
      s3.moveObjects('settlement-account', 'inactive-settlement-account', userEmail),
      s3.moveObjects('mail-order', 'inactive-mail-order', userEmail),
    ]);
    await this.deleteSellerSocialAccountNull(sellerId.id);
    await this.updateSellerNull(sellerId.id);
  }
}
