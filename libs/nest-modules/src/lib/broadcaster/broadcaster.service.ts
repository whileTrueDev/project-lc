import { Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterAddress, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterAddressDto,
  BroadcasterDTO,
  BroadcasterRes,
  FindBroadcasterDto,
  FindSellerRes,
  SignUpDto,
} from '@project-lc/shared-types';
import { hash } from 'argon2';
import { throwError } from 'rxjs';

@Injectable()
export class BroadcasterService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserId(overlayUrl: string): Promise<{ userId: string }> {
    const userId = await this.prisma.broadcaster.findUnique({
      select: {
        userId: true,
      },
      where: {
        overlayUrl,
      },
    });
    if (!userId) {
      throwError('Fail to get userId by overlayUrl');
    }
    return userId;
  }

  async getAllBroadcasterIdAndNickname(): Promise<BroadcasterDTO[]> {
    return this.prisma.broadcaster.findMany({
      where: {
        deleteFlag: false,
      },
      select: {
        userId: true,
        userNickname: true,
      },
    });
  }

  /** 방송인 회원가입 서비스 핸들러 */
  async signUp(dto: SignUpDto): Promise<Broadcaster> {
    const hashedPw = await hash(dto.password);
    const broadcaster = await this.prisma.broadcaster.create({
      data: {
        userId: dto.email,
        email: dto.email,
        userName: dto.name,
        password: hashedPw,
        userNickname: '',
        overlayUrl: `/${dto.email}`,
      },
    });
    return broadcaster;
  }

  /**
   * 방송인 테이블에서 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.broadcaster.findFirst({ where: { userId: email } });
    if (user) return false;
    return true;
  }

  /**
   * 방송인 정보 조회
   // TODO : 소셜로그인 한 방송인 정보 받기위해 임시로 작성함. 추후 수정 필요
   */
  async findOne(findInput: Prisma.BroadcasterWhereUniqueInput): Promise<FindSellerRes> {
    const broadcaster = await this.prisma.broadcaster.findUnique({
      where: findInput,
      select: {
        id: true,
        userId: true, // 이메일
        userName: true,
        password: true,
        avatar: true,
      },
    });

    if (!broadcaster) {
      return null;
    }
    const { userId: email, userName: name, id, password, avatar } = broadcaster;
    return {
      id,
      email,
      name,
      password,
      avatar,
    };
  }

  /** 방송인 정보 조회 */
  public async getBroadcaster(opt: FindBroadcasterDto): Promise<BroadcasterRes | null> {
    const { id, email } = opt;
    if (id)
      return this.prisma.broadcaster.findUnique({
        where: { id: Number(id) },
        include: {
          broadcasterAddress: true,
        },
      });
    if (email)
      return this.prisma.broadcaster.findUnique({
        where: { userId: email },
        include: {
          broadcasterAddress: true,
        },
      });
    return null;
  }

  /** 방송인 활동명 변경 */
  public async updateNickname(
    id: Broadcaster['id'],
    newNick: string,
  ): Promise<Broadcaster> {
    return this.prisma.broadcaster.update({
      where: { id },
      data: { userNickname: newNick },
    });
  }

  /** 방송인 선물/샘플 수령 주소 생성 및 수정 */
  public async upsertAddress(
    broadcasterId: Broadcaster['id'],
    dto: BroadcasterAddressDto,
  ): Promise<BroadcasterAddress> {
    const { address, detailAddress, postalCode } = dto;
    return this.prisma.broadcasterAddress.upsert({
      where: { broadcasterId },
      create: {
        address,
        detailAddress,
        postalCode,
        broadcasterId,
      },
      update: {
        address,
        detailAddress,
        postalCode,
        broadcasterId,
      },
    });
  }
}
