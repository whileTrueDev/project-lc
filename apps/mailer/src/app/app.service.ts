import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import * as dayjs from 'dayjs';
import { Broadcaster, Seller } from '@prisma/client';
import { MailNoticeService } from '../lib/mail/mail-notice.service';
import { S3Service } from '../lib/s3/s3.service';
@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailNoticeService: MailNoticeService,
    private readonly s3Service: S3Service,
  ) {}

  getLastLoginDate(): Promise<any> {
    return this.prisma
      .$queryRaw`SELECT t1.userType, t1.userEmail, DATEDIFF(CURDATE(), t1.createDate) as timeDiff
    FROM LoginHistory AS t1 JOIN (
    SELECT userEmail, MAX(createDate) AS createDate
    FROM LoginHistory 
    GROUP BY userEmail, userType
    ) a
    ON t1.userEmail = a.userEmail 
    AND t1.createDate = a.createDate
    WHERE userType != "admin" 
    AND DATEDIFF(CURDATE(), t1.createDate) = 335 
    OR DATEDIFF(CURDATE(), t1.createDate) = 366;
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

  private getBroadcasterId(email): Promise<{ id: number }> {
    return this.prisma.broadcaster.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

  private getSellerId(email): Promise<{ id: number }> {
    return this.prisma.seller.findFirst({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
  }

  private copyBroadcasterRow(broadcasterId): Promise<any> {
    return this.prisma
      .$executeRaw`INSERT INTO InactiveBroadcaster (id, email, userName, userNickname, overlayUrl, avatar, password)
    SELECT 
        id, email, userName, userNickname, overlayUrl,  avatar, password
    FROM 
        Broadcaster
    WHERE 
        id = ${broadcasterId};`;
  }

  private copySellerRow(sellerId): Promise<any> {
    return this.prisma
      .$executeRaw`INSERT INTO InactiveSeller (id, email, name, avatar, password)
    SELECT 
      id, email, name, avatar, password
    FROM 
        Seller
    WHERE 
        id = ${sellerId};`;
  }

  private copySocialBroadcasterRow(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterSocialAccount
      (serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, broadcasterId)
    SELECT 
      serviceId, provider, name, registDate, profileImage, accessToken, refreshToken, broadcasterId
    FROM 
      BroadcasterSocialAccount
    WHERE 
      id = ${broadcasterId};`;
  }

  private copySocialSellerRow(sellerId): Promise<any> {
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

  private updateBroadcasterNull(broadcasterId): Promise<Broadcaster> {
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

  private deleteBroadcasterSocialAccountNull(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM 
        BroadcasterSocialAccount 
      WHERE broadcasterId = ${broadcasterId}`;
  }

  private updateSellerNull(sellerId): Promise<Seller> {
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

  private deleteSellerSocialAccountNull(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
      Delete FROM
        SellerSocialAccount 
      WHERE sellerId = ${sellerId}`;
  }

  private copyBroadcasterAddress(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterAddress 
      (id, address, detailAddress, postalCode, createDate, broadcasterId)
    SELECT 
      id, address, detailAddress, postalCode, createDate, broadcasterId
    FROM 
      BroadcasterAddress
    WHERE 
      id = ${broadcasterId}
    `;
  }

  private copyBroadcasterChannel(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterChannel
      (id, url, createDate, broadcasterId)
    SELECT 
      id, url, createDate, broadcasterId
    FROM 
      BroadcasterChannel
    WHERE 
      id = ${broadcasterId}
    `;
  }

  private copyBroadcasterContacts(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterContacts
      (id, name, email, phoneNumber, isDefault, createDate, broadcasterId)
    SELECT 
      id, name, email, phoneNumber, isDefault, createDate, broadcasterId
    FROM 
      BroadcasterChannel
    WHERE 
      id = ${broadcasterId}
    `;
  }

  private copyBroadcasterSettlementInfo(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBroadcasterSettlementInfo
      (id, type, name, idCardNumber, phoneNumber, bank, accountNumber, accountHolder, idCardImageName, accountImageName, taxManageAgreement, personalInfoAgreement, settlementAgreement, broadcasterId)
    SELECT 
    id, type, name, idCardNumber, phoneNumber, bank, accountNumber, accountHolder, idCardImageName, accountImageName, taxManageAgreement, personalInfoAgreement, settlementAgreement, broadcasterId
    FROM 
      BroadcasterSettlementInfo
    WHERE 
      id = ${broadcasterId}
    `;
  }

  private copySellerBusinessRegistration(sellerId): Promise<any> {
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
    FROM 
      SellerBusinessRegistration
    JOIN 
        BusinessRegistrationConfirmation as brc
    ON 
        brc.SellerBusinessRegistrationId
    WHERE 
      id = ${sellerId}
    `;
  }

  private copySellerContacts(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveSellerContacts
      (id, sellerId, email, phoneNumber, isDefault, createDate)
    SELECT 
    id, sellerId, email, phoneNumber, isDefault, createDate
    FROM 
      SellerContacts
    WHERE 
      id = ${sellerId}
    `;
  }

  private copySellerSettlementAccount(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveSellerSettlementAccount
      (id, sellerEmail, bank, number, name, settlementAccountImageName)
    SELECT 
      id, sellerEmail, bank, number, name, settlementAccountImageName
    FROM 
      SellerSettlementAccount
    WHERE 
      id = ${sellerId}
    `;
  }

  private copyBusinessRegistrationConfirmation(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
    INSERT INTO InactiveBusinessRegistrationConfirmation
      (id, status, rejectionReason, InactiveSellerBusinessRegistrationId)
    SELECT 
    id, status, rejectionReason, sellerBusinessRegistrationId
    FROM 
      BusinessRegistrationConfirmation
    WHERE 
      id = ${sellerId}
  `;
  }

  private deleteBroadcasterAddress(broadcasterId): Promise<any> {
    return this.prisma.broadcasterAddress.delete({
      where: {
        broadcasterId,
      },
    });
  }

  private deleteBroadcasterChannel(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM BroadcasterChannel WHERE broadcasterId=${broadcasterId}`;
  }

  private deleteBroadcasterContacts(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM BroadcasterContacts WHERE broadcasterId=${broadcasterId}`;
  }

  private deleteBroadcasterSettlementInfo(broadcasterId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM BroadcasterSettlementInfo WHERE broadcasterId=${broadcasterId}`;
  }

  private deleteSellerBusinessRegistration(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM SellerBusinessRegistration WHERE sellerId=${sellerId}`;
  }

  private deleteSellerContacts(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM SellerContacts WHERE sellerId=${sellerId}`;
  }

  private deleteSellerSettlementAccount(sellerId): Promise<any> {
    return this.prisma.$executeRaw`
      DELETE FROM SellerSettlementAccount WHERE sellerId=${sellerId}`;
  }

  async moveInactiveUserData(inactivateTarget): Promise<void> {
    if (inactivateTarget.userType === 'seller') {
      // s3 데이터 분리
      const sellerId = await this.getSellerId(inactivateTarget.userEmail);
      Promise.all([
        await this.copySellerRow(sellerId.id),
        await this.copySocialSellerRow(sellerId.id),
        this.updateSellerNull(sellerId.id),
        this.deleteSellerSocialAccountNull(sellerId.id),
        this.copySellerBusinessRegistration(sellerId.id).then(() =>
          this.deleteSellerBusinessRegistration(sellerId.id),
        ),
        this.copyBusinessRegistrationConfirmation(sellerId.id),
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
    } else if (inactivateTarget.userType === 'broadcaster') {
      const broadcasterId = await this.getBroadcasterId(inactivateTarget.userEmail);
      // s3 데이터 분리
      Promise.all([
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
