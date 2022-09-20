import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CipherService } from '@project-lc/nest-modules-cipher';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  AdminBroadcasterSettlementInfoList,
  BroadcasterSettlementInfoDto,
  BroadcasterSettlementInfoRes,
} from '@project-lc/shared-types';
import { Broadcaster, BroadcasterSettlementInfo } from '.prisma/client';
import { BroadcasterService } from '../broadcaster.service';

@Injectable()
export class BroadcasterSettlementInfoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
    private readonly cipherService: CipherService,
  ) {}

  /** 방송인 정산정보 등록 및 수정 */
  async insertSettlementInfo(
    dto: BroadcasterSettlementInfoDto,
  ): Promise<BroadcasterSettlementInfo> {
    const { broadcasterId, ...data } = dto;

    const broadcaster = await this.broadcasterService.findOne({ id: broadcasterId });
    if (!broadcaster) {
      throw new BadRequestException(
        `해당 방송인이 존재하지 않습니다 broadcasterId: ${broadcasterId}`,
      );
    }

    // 주민등록번호, 휴대전화, 계좌번호는 암호화하여 저장
    const { idCardNumber, phoneNumber, accountNumber } = data;

    const encryptedData = {
      idCardNumber: this.cipherService.getEncryptedText(idCardNumber),
      phoneNumber: this.cipherService.getEncryptedText(phoneNumber),
      accountNumber: this.cipherService.getEncryptedText(accountNumber),
    };

    try {
      const result = await this.prisma.broadcasterSettlementInfo.upsert({
        where: { broadcasterId },
        create: {
          ...data,
          ...encryptedData,
          broadcaster: { connect: { id: broadcasterId } },
          confirmation: { create: { rejectionReason: null } },
        },
        update: {
          ...data,
          ...encryptedData,
          confirmation: { update: { status: 'waiting' } },
        },
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async restoreBroadcasterSettlement(
    broadcasterId: Broadcaster['id'],
  ): Promise<null | BroadcasterSettlementInfo> {
    const restoreData = await this.prisma.inactiveBroadcasterSettlementInfo.findFirst({
      where: {
        broadcasterId,
      },
    });

    if (restoreData) {
      return this.prisma.broadcasterSettlementInfo.create({
        data: restoreData || undefined,
      });
    }
    return null;
  }

  async restoreBroadcasterSettlementConfirmation(
    settlementInfoId: number,
  ): Promise<void> {
    const restoreData =
      await this.prisma.inactiveBroadcasterSettlementInfoConfirmation.findFirst({
        where: {
          settlementInfoId,
        },
      });
    if (restoreData) {
      await this.prisma.broadcasterSettlementInfoConfirmation.create({
        data: restoreData || undefined,
      });
    }
  }

  /** 방송인 정산정보 조회
   * @param broadcasterId 방송인 고유id
   * @return 정산정보(주민등록번호, 휴대전화는 복호화하여 일부 가린상태) + 검수여부
   */
  async selectBroadcasterSettlementInfo(
    broadcasterId: number,
  ): Promise<BroadcasterSettlementInfoRes> {
    try {
      const data = await this.prisma.broadcasterSettlementInfo.findUnique({
        where: { broadcasterId },
        include: { confirmation: true },
      });
      if (!data) return null;

      // 주민등록번호, 휴대전화는 복호화 한 후 일부를 가린상태로 전송, 계좌번호는 그냥 복호화
      const { idCardNumber, phoneNumber, accountNumber } = data;

      return {
        ...data,
        idCardNumber: this.decryptIdCardNumber(idCardNumber, { blind: true }),
        phoneNumber: this.decryptPhoneNumber(phoneNumber, { blind: true }),
        accountNumber: this.cipherService.getDecryptedText(accountNumber),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** 문자열을 *로 바꿔서 리턴 */
  private blind(text: string, replaceText = '*'): string {
    return text.replace(/./g, replaceText);
  }

  /** 정산정보 - 암호화된 핸드폰번호를 복호화 & blind에 true 넘기면 일부를 가리고 리턴함 */
  private decryptPhoneNumber(
    encrypted?: string,
    option?: { blind?: boolean },
  ): string | null {
    if (!encrypted) return null;
    const data = this.cipherService.getDecryptedText(encrypted);
    // 전화번호는 010-1234-1234 형태로 입력된다

    if (option?.blind) {
      const [first, second, third] = data.split('-');
      return [first, this.blind(second), third].join('-');
    }
    return data;
  }

  /** 정산정보 - 암호화된 주민등록번호를 복호화 & blind에 true 넘기면 일부를 가리고 리턴함  */
  private decryptIdCardNumber(
    encrypted?: string,
    option?: { blind?: boolean },
  ): string | null {
    if (!encrypted) return null;
    const data = this.cipherService.getDecryptedText(encrypted);
    // 주민등록번호는 000000-0000000 형태로 입력된다

    if (option?.blind) {
      const [first, second] = data.split('-');
      return [first, this.blind(second)].join('-');
    }

    return data;
  }

  /** 방송인 정산정보 신청 목록 조회 - 핸드폰번호, 주민등록번호 가리지 않고 그대로 리턴함
   * 검수정보, 방송인 이메일, 닉네임 포함
   *
   */
  public async getBroadcasterSettlementInfoList(): Promise<AdminBroadcasterSettlementInfoList> {
    // 방송인 email, userNickname, settlementInfo,
    const data = await this.prisma.broadcasterSettlementInfo.findMany({
      select: {
        id: true,
        type: true,
        name: true,
        idCardNumber: true,
        idCardImageName: true,
        phoneNumber: true,
        bank: true,
        accountNumber: true,
        accountHolder: true,
        accountImageName: true,
        confirmation: true,
        broadcasterId: true,
        broadcaster: { select: { email: true, userNickname: true } },
      },
      orderBy: { id: 'desc' },
    });
    return data.map((d) => ({
      ...d,
      idCardNumber: this.decryptIdCardNumber(d.idCardNumber),
      phoneNumber: this.decryptPhoneNumber(d.phoneNumber),
      accountNumber: this.cipherService.getDecryptedText(d.accountNumber),
    }));
  }
}
