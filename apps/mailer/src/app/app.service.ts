import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as dayjs from 'dayjs';
import { Broadcaster, Seller } from '@prisma/client';
import { MailNoticeService } from '../lib/mail/mail-notice.service';
import { S3Service } from '../lib/s3/s3.service';

export type LastLoginDate = {
  userType: 'seller' | 'broadcaster';
  userEmail: string;
  timeDiff: number;
};

export type BatchPayload = {
  count: number;
};
@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailNoticeService: MailNoticeService,
    private readonly s3Service: S3Service,
  ) {}

  getLastLoginDate(): Promise<LastLoginDate[]> {
    return this.prisma.$queryRaw`
    SELECT 
      t1.userType, t1.userEmail, DATEDIFF(CURDATE(), t1.createDate) as timeDiff
    FROM 
      LoginHistory AS t1 JOIN (
    SELECT 
      userEmail, MAX(createDate) AS createDate
    FROM 
      LoginHistory 
    GROUP BY 
      userEmail, userType
    ) a
    ON 
      t1.userEmail = a.userEmail 
    AND 
      t1.createDate = a.createDate
    WHERE 
      userType != "admin" 
    AND 
      DATEDIFF(CURDATE(), t1.createDate) = 335 
    OR 
      DATEDIFF(CURDATE(), t1.createDate) = 366;
    `;
  }

  sendMail(mailTargets): void {
    const daysInKorean = ['일', '월', '화', '수', '목', '금', '토'];
    const inactivateDate = dayjs().add(31, 'day');
    const inactivateDateWithDayInKorean = `${inactivateDate.format('YYYY-MM-DD')} (${
      daysInKorean[inactivateDate.day()]
    })`;
    mailTargets.forEach((user) =>
      user.timeDiff === 335
        ? this.mailNoticeService.sendPreInactivateMail({
            userEmail: user.userEmail,
            inactivateDate: inactivateDateWithDayInKorean,
            userType: user.userType,
          })
        : this.mailNoticeService.sendInactivateMail({
            userEmail: user.userEmail,
            userType: user.userType,
          }),
    );
  }

  private getBroadcasterId(email: string): Promise<{ id: number }> {
    return this.prisma.broadcaster.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

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

  private copyBroadcasterRow(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
      INSERT INTO InactiveBroadcaster 
        (id, email, userName, userNickname, overlayUrl, avatar, password, deleteFlag, agreementFlag)
      SELECT 
        id, email, userName, userNickname, overlayUrl,  avatar, password, deleteFlag, agreementFlag
      FROM 
        Broadcaster
      WHERE 
        id = ${broadcasterId};`;
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

  private copySocialBroadcasterRow(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterSocialAccount 
      (serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, broadcasterId)
    SELECT 
      serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, broadcasterId
    FROM 
      BroadcasterSocialAccount
    WHERE 
      broadcasterId = ${broadcasterId};`;
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

  private updateBroadcasterNull(broadcasterId: number): Promise<Broadcaster> {
    return this.prisma.broadcaster.update({
      where: {
        id: broadcasterId,
      },
      data: {
        email: null,
        userName: null,
        overlayUrl: null,
        avatar: null,
        password: null,
        inactiveFlag: true,
      },
    });
  }

  private deleteBroadcasterSocialAccountNull(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        BroadcasterSocialAccount 
      WHERE 
        broadcasterId = ${broadcasterId}`;
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

  private copyBroadcasterAddress(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterAddress 
      (id, address, detailAddress, postalCode, createDate, broadcasterId)
    SELECT 
      id, address, detailAddress, postalCode, createDate, broadcasterId
    FROM 
      BroadcasterAddress
    WHERE 
      broadcasterId = ${broadcasterId}
    `;
  }

  private copyBroadcasterChannel(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterChannel 
      (id, url, createDate, broadcasterId)
    SELECT 
      id, url, createDate, broadcasterId
    FROM 
      BroadcasterChannel
    WHERE 
      broadcasterId = ${broadcasterId}
    `;
  }

  private copyBroadcasterContacts(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterContacts
      (id, name, email, phoneNumber, isDefault, createDate, broadcasterId)
    SELECT 
      id, name, email, phoneNumber, isDefault, createDate, broadcasterId
    FROM 
      BroadcasterContacts
    WHERE 
      broadcasterId = ${broadcasterId}
    `;
  }

  private copyBroadcasterSettlementInfo(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterSettlementInfo
      (id, type, name, idCardNumber, phoneNumber, bank, accountNumber, accountHolder, idCardImageName, accountImageName, taxManageAgreement, personalInfoAgreement, settlementAgreement, broadcasterId)
    SELECT 
      id, type, name, idCardNumber, phoneNumber, bank, accountNumber, accountHolder, idCardImageName, accountImageName, taxManageAgreement, personalInfoAgreement, settlementAgreement, broadcasterId
    FROM 
      BroadcasterSettlementInfo
    WHERE 
      broadcasterId = ${broadcasterId}
    `;
  }

  private copyBroadcasterSettlementInfoConfirmation(
    broadcasterId: number,
  ): Promise<number> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterSettlementInfoConfirmation
      (id, status, rejectionReason, settlementInfoId)
    SELECT 
      bsic.id, status, rejectionReason, settlementInfoId
    FROM 
      BroadcasterSettlementInfoConfirmation as bsic
    JOIN 
      BroadcasterSettlementInfo as bsi
    ON
      bsi.id = bsic.settlementInfoId
    WHERE 
      bsi.broadcasterId = ${broadcasterId}
    `;
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

  private updateLiveShoppingSellerContactNull(sellerId: number): Promise<BatchPayload> {
    return this.prisma.liveShopping.updateMany({
      where: {
        sellerId,
      },
      data: {
        contactId: null,
      },
    });
  }

  private deleteBroadcasterAddress(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
    DELETE FROM 
      BroadcasterAddress 
    WHERE 
      broadcasterId=${broadcasterId}`;
  }

  private deleteBroadcasterChannel(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        BroadcasterChannel 
      WHERE 
        broadcasterId=${broadcasterId}`;
  }

  private deleteBroadcasterContacts(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        BroadcasterContacts 
      WHERE 
        broadcasterId=${broadcasterId}`;
  }

  private deleteBroadcasterSettlementInfo(broadcasterId: number): Promise<number> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        BroadcasterSettlementInfo 
      WHERE 
        broadcasterId=${broadcasterId}`;
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

  async moveInactiveUserData(inactivateTarget: LastLoginDate): Promise<void> {
    if (inactivateTarget.userType === 'seller') {
      // s3 데이터 분리
      const sellerId = await this.getSellerId(inactivateTarget.userEmail);
      await Promise.all<void | number | Seller | BatchPayload>([
        await this.copySellerRow(sellerId.id),
        await this.copySocialSellerRow(sellerId.id),
        // await this.updateLiveShoppingSellerContactNull(sellerId.id),
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
        this.s3Service.moveObjects('business-registration', inactivateTarget.userEmail),
        this.s3Service.moveObjects('settlement-account', inactivateTarget.userEmail),
        this.s3Service.moveObjects('mail-order', inactivateTarget.userEmail),
      ]);
      await this.deleteSellerSocialAccountNull(sellerId.id);
      await this.updateSellerNull(sellerId.id);
    } else if (inactivateTarget.userType === 'broadcaster') {
      const broadcasterId = await this.getBroadcasterId(inactivateTarget.userEmail);
      // s3 데이터 분리
      Promise.all<void | number | Broadcaster>([
        await this.copyBroadcasterRow(broadcasterId.id),
        await this.copySocialBroadcasterRow(broadcasterId.id),
        this.updateBroadcasterNull(broadcasterId.id),
        this.deleteBroadcasterSocialAccountNull(broadcasterId.id),
        this.copyBroadcasterAddress(broadcasterId.id).then(() =>
          this.deleteBroadcasterAddress(broadcasterId.id),
        ),
        this.copyBroadcasterChannel(broadcasterId.id).then(() =>
          this.deleteBroadcasterChannel(broadcasterId.id),
        ),
        this.copyBroadcasterContacts(broadcasterId.id).then(() =>
          this.deleteBroadcasterContacts(broadcasterId.id),
        ),
        this.copyBroadcasterSettlementInfoConfirmation(broadcasterId.id),
        this.copyBroadcasterSettlementInfo(broadcasterId.id).then(() =>
          this.deleteBroadcasterSettlementInfo(broadcasterId.id),
        ),
        this.s3Service.moveObjects(
          'broadcaster-account-image',
          inactivateTarget.userEmail,
        ),
        this.s3Service.moveObjects('broadcaster-id-card', inactivateTarget.userEmail),
      ]);
    }
  }
}
