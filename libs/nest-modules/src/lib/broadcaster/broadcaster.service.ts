import { BadRequestException, Injectable } from '@nestjs/common';
import { Broadcaster, BroadcasterAddress, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterAddressDto,
  BroadcasterDTO,
  BroadcasterRes,
  FindBroadcasterDto,
  SignUpDto,
} from '@project-lc/shared-types';
import { hash, verify } from 'argon2';
import { throwError } from 'rxjs';

@Injectable()
export class BroadcasterService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserId(overlayUrl: string): Promise<{ userId: string }> {
    const email = await this.prisma.broadcaster.findUnique({
      select: {
        email: true,
      },
      where: {
        overlayUrl,
      },
    });
    if (!email) {
      throwError('Fail to get userId by overlayUrl');
    }
    return { userId: email.email };
  }

  async getAllBroadcasterIdAndNickname(): Promise<BroadcasterDTO[]> {
    return this.prisma.broadcaster.findMany({
      where: {
        deleteFlag: false,
      },
      select: {
        email: true,
        userNickname: true,
      },
    });
  }

  // 로그인 로직에 필요한 함수
  /**
   * 로그인
   */
  async login(email: string, pwdInput: string): Promise<Broadcaster | null> {
    const user = await this.findOne({ email });
    if (!user) {
      return null;
    }
    if (user.password === null) {
      // 소셜로그인으로 가입된 회원
      throw new BadRequestException();
    }
    const isCorrect = await this.validatePassword(pwdInput, user.password);
    if (!isCorrect) {
      return null;
    }
    return user;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.SellerWhereUniqueInput): Promise<Broadcaster> {
    const broadcaster = await this.prisma.broadcaster.findUnique({
      where: findInput,
    });
    return broadcaster;
  }

  /** 방송인 회원가입 서비스 핸들러 */
  async signUp(dto: SignUpDto): Promise<Broadcaster> {
    const hashedPw = await hash(dto.password);
    const broadcaster = await this.prisma.broadcaster.create({
      data: {
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
   * 입력한 비밀번호를 해시된 비밀번호와 비교합니다.
   * @param pwInput 입력한 비밀번호 문자열
   * @param hashedPw 해시된 비밀번호 값
   * @returns {boolean} 올바른 비밀번호인지 여부
   */
  async validatePassword(pwInput: string, hashedPw: string): Promise<boolean> {
    const isCorrect = await verify(hashedPw, pwInput);
    return isCorrect;
  }

  /**
   * 방송인 테이블에서 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.broadcaster.findFirst({ where: { email } });
    if (user) return false;
    return true;
  }

  /**
   * 방송인 정보 조회
   // TODO : 소셜로그인 한 방송인 정보 받기위해 임시로 작성함. 추후 수정 필요
   */
  // async findOne(findInput: Prisma.BroadcasterWhereUniqueInput): Promise<FindSellerRes> {
  //   const broadcaster = await this.prisma.broadcaster.findUnique({
  //     where: findInput,
  //     select: {
  //       id: true,
  //       userId: true, // 이메일
  //       userName: true,
  //       password: true,
  //       avatar: true,
  //     },
  //   });

  //   if (!broadcaster) {
  //     return null;
  //   }
  //   const { userId: email, userName: name, id, password, avatar } = broadcaster;
  //   return {
  //     id,
  //     email,
  //     name,
  //     password,
  //     avatar,
  //   };
  // }

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
        where: { email },
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
