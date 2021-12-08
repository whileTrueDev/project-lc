import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterSettlementInfoDto,
  BroadcasterSettlementInfoRes,
} from '@project-lc/shared-types';
import { BroadcasterSettlementInfo } from '.prisma/client';
import { BroadcasterService } from './broadcaster.service';
import { CipherService } from '../auth/cipher.service';

@Injectable()
export class BroadcasterSettlementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly broadcasterService: BroadcasterService,
    private cipherService: CipherService,
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

    // 주민등록번호, 휴대전화는 암호화하여 저장
    const { idCardNumber, phoneNumber } = data;

    try {
      return this.prisma.broadcasterSettlementInfo.upsert({
        where: { broadcasterId },
        create: {
          ...data,
          idCardNumber: this.cipherService.getEncryptedText(idCardNumber),
          phoneNumber: this.cipherService.getEncryptedText(phoneNumber),
          broadcaster: { connect: { id: broadcasterId } },
          confirmation: { create: { rejectionReason: null } },
        },
        update: {
          ...data,
          idCardNumber: this.cipherService.getEncryptedText(idCardNumber),
          phoneNumber: this.cipherService.getEncryptedText(phoneNumber),
          confirmation: { update: { status: 'waiting' } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
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

      // 주민등록번호, 휴대전화는 복호화 한 후 일부를 가린상태로 전송
      const { idCardNumber, phoneNumber } = data;

      return {
        ...data,
        idCardNumber: this.blindIdCardNumber(idCardNumber),
        phoneNumber: this.blindPhoneNumber(phoneNumber),
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /** 정산정보 - 암호화된 핸드폰번호를 복호화 & 일부를 가리고 리턴함 */
  private blindPhoneNumber(encrypted?: string): string | null {
    if (!encrypted) return null;
    const data = this.cipherService.getDecryptedText(encrypted);
    // 전화번호는 010-1234-1234 형태로 입력된다
    const [first, second, third] = data.split('-');
    return [first, second.replace(/./g, '*'), third].join('-');
  }

  /** 정산정보 - 암호화된 주민등록번호를 복호화 & 일부를 가리고 리턴함 */
  private blindIdCardNumber(encrypted?: string): string | null {
    if (!encrypted) return null;
    const data = this.cipherService.getDecryptedText(encrypted);
    // 주민등록번호는 000000-0000000 형태로 입력된다
    const [first, second] = data.split('-');
    return [first, second.replace(/./g, '*')].join('-');
  }
}
