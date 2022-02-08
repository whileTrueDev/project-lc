import __multer from 'multer';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Broadcaster, BroadcasterAddress, Prisma } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterAddressDto,
  BroadcasterDTO,
  BroadcasterRes,
  FindBroadcasterDto,
  BroadcasterWithoutUserNickName,
  SignUpDto,
  broadcasterProductPromotionDto,
} from '@project-lc/shared-types';
import { hash, verify } from 'argon2';
import { S3Service } from '@project-lc/nest-modules-s3';

@Injectable()
export class BroadcasterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
  ) {}

  async getBroadcasterEmail(overlayUrl: string): Promise<BroadcasterWithoutUserNickName> {
    const dto = await this.prisma.broadcaster.findUnique({
      select: {
        id: true,
        email: true,
      },
      where: {
        overlayUrl,
      },
    });

    return dto;
  }

  async getAllBroadcasterIdAndNickname(): Promise<BroadcasterDTO[]> {
    return this.prisma.broadcaster.findMany({
      where: {
        deleteFlag: false,
      },
      select: {
        id: true,
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
      throw new UnauthorizedException();
    }
    if (user.password === null) {
      // 소셜로그인으로 가입된 회원
      throw new BadRequestException();
    }
    const isCorrect = await this.validatePassword(pwdInput, user.password);
    if (!isCorrect) {
      throw new UnauthorizedException();
    }
    return user;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.BroadcasterWhereUniqueInput): Promise<Broadcaster> {
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
   * 비밀번호를 단방향 암호화 합니다.
   * @param purePw 비밀번호 문자열
   * @returns {string} 비밀번호 해시값
   */
  private async hashPassword(purePw: string): Promise<string> {
    const hashed = await hash(purePw);
    return hashed;
  }

  /**
   * 입력된 이메일을 가진 유저가 본인 인증을 하기 위해 비밀번호를 확인함
   * @param email 본인 이메일
   * @param password 본인 비밀번호
   * @returns boolean 비밀번호가 맞는지
   */
  async checkPassword(email: string, password: string): Promise<boolean> {
    const seller = await this.findOne({ email });
    if (!seller.password) {
      throw new BadRequestException(
        '소셜계정으로 가입된 회원입니다. 비밀번호를 등록해주세요.',
      );
    }
    return this.validatePassword(password, seller.password);
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

  /**
   * 비밀번호 변경
   * @param email 비밀번호 변경할 셀러의 email
   * @param newPassword 새로운 비밀번호
   * @returns
   */
  async changePassword(email: string, newPassword: string): Promise<Broadcaster> {
    const hashedPw = await this.hashPassword(newPassword);
    const broadcaster = await this.prisma.broadcaster.update({
      where: { email },
      data: {
        password: hashedPw,
      },
    });
    return broadcaster;
  }

  /** 방송인 broadcaster 삭제 */
  async deleteOne(email: string): Promise<boolean> {
    await this.prisma.broadcaster.delete({
      where: { email },
    });

    return true;
  }

  /** 이용동의 상태 변경 */
  async changeContractionAgreement(
    email: string,
    agreementFlag: boolean,
  ): Promise<Broadcaster> {
    const broadcaster = await this.prisma.broadcaster.update({
      where: { email },
      data: {
        agreementFlag,
      },
    });
    return broadcaster;
  }

  /** 방송인 아바타 이미지 url 저장 */
  public async addBroadcasterAvatar(
    email: Broadcaster['email'],
    file: Express.Multer.File,
  ): Promise<boolean> {
    const avatarUrl = await this.s3service.uploadProfileImage({
      key: file.originalname,
      file: file.buffer,
      email,
      userType: 'broadcaster',
    });
    await this.prisma.broadcaster.update({
      where: { email },
      data: { avatar: avatarUrl },
    });
    return true;
  }

  /** 방송인 아바타 이미지 url null 로 초기화 */
  public async removeBroadcasterAvatar(email: Broadcaster['email']): Promise<boolean> {
    await this.prisma.broadcaster.update({
      where: { email },
      data: { avatar: null },
    });
    return true;
  }

  public async getFmGoodsSeqLinkedToProductPromotions(
    id: Broadcaster['id'],
  ): Promise<broadcasterProductPromotionDto[]> {
    const productPromotionFmGoodsSeq =
      await this.prisma.broadcasterPromotionPage.findMany({
        where: {
          broadcasterId: id,
        },
        select: {
          productPromotions: {
            select: {
              fmGoodsSeq: true,
            },
          },
        },
      });
    const fmGoodsSeqs = productPromotionFmGoodsSeq.pop().productPromotions;
    return fmGoodsSeqs;
  }
}
