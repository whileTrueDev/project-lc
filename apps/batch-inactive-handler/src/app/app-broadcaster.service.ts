import { Injectable } from '@nestjs/common';
import { Broadcaster } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class AppBroadcasterService {
  constructor(private readonly prisma: PrismaService) {}

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

  async moveBraodcasterData(userEmail: string): Promise<void> {
    const broadcasterId = await this.getBroadcasterId(userEmail);
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
      s3.moveObjects(
        'broadcaster-account-image',
        'inactive-broadcaster-account-image',
        userEmail,
      ),
      s3.moveObjects('broadcaster-id-card', 'inactive-broadcaster-id-card', userEmail),
    ]);
  }
}
