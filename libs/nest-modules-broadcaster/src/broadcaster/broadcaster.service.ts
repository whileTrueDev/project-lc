import __multer from 'multer';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  Broadcaster,
  BroadcasterAddress,
  InactiveBroadcaster,
  BroadcasterPromotionPage,
  Prisma,
  BroadcasterSocialAccount,
} from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BroadcasterAddressDto,
  BroadcasterDTO,
  BroadcasterRes,
  FindBroadcasterDto,
  BroadcasterWithoutUserNickName,
  SignUpDto,
} from '@project-lc/shared-types';
import { hash, verify } from 'argon2';
import { S3Service } from '@project-lc/nest-modules-s3';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';

@Injectable()
export class BroadcasterService extends ServiceBaseWithCache {
  #BROADCASTER_CACHE_KEY = 'broadcaster';

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
  ) {
    super(cacheManager);
  }

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
        BroadcasterPromotionPage: true,
      },
    });
  }

  // 로그인 로직에 필요한 함수
  /**
   * 로그인
   */
  async login(
    email: string,
    pwdInput: string,
  ): Promise<Broadcaster | InactiveBroadcaster | null> {
    const user = await this.findOne({ email });
    let inactiveUser;
    if (!user) {
      inactiveUser = await this.findInactiveOne({ email });
      if (!inactiveUser) {
        throw new UnauthorizedException();
      }
    }
    if (user?.password === null || inactiveUser?.password === null) {
      // 소셜로그인으로 가입된 회원
      throw new BadRequestException();
    }
    const isCorrect = await this.validatePassword(
      pwdInput,
      user?.password || inactiveUser?.password,
    );
    if (!isCorrect) {
      throw new UnauthorizedException();
    }

    if (inactiveUser) {
      return inactiveUser;
    }
    return user;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(
    findInput: Prisma.BroadcasterWhereUniqueInput,
  ): Promise<Broadcaster & { broadcasterPromotionPage?: BroadcasterPromotionPage }> {
    const broadcaster = await this.prisma.broadcaster.findUnique({
      where: findInput,
      include: { BroadcasterPromotionPage: true },
    });
    if (broadcaster) {
      const { BroadcasterPromotionPage: broadcasterPromotionPage, ...broadcasterData } =
        broadcaster;
      return { ...broadcasterData, broadcasterPromotionPage };
    }
    return null;
  }

  /**
   * 휴면 유저 정보 조회
   */
  async findInactiveOne(
    findInput: Prisma.SellerWhereUniqueInput,
  ): Promise<InactiveBroadcaster> {
    const broadcaster = await this.prisma.inactiveBroadcaster.findUnique({
      where: findInput,
    });

    if (!broadcaster) {
      return broadcaster;
    }

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
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
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
    const inactiveUser = await this.prisma.inactiveBroadcaster.findFirst({
      where: { email },
    });
    if (user || inactiveUser) return false;
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
    const updated = await this.prisma.broadcaster.update({
      where: { id },
      data: { userNickname: newNick },
    });
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
    return updated;
  }

  /** 방송인 선물/샘플 수령 주소 생성 및 수정 */
  public async upsertAddress(
    broadcasterId: Broadcaster['id'],
    dto: BroadcasterAddressDto,
  ): Promise<BroadcasterAddress> {
    const { address, detailAddress, postalCode } = dto;
    const result = await this.prisma.broadcasterAddress.upsert({
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
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
    return result;
  }

  /** 휴면 방송인 선물/샘플 수령 주소 복구 */
  public async restoreBroadcasterAddress(
    broadcasterId: Broadcaster['id'],
  ): Promise<void> {
    const restoreData = await this.prisma.inactiveBroadcasterAddress.findFirst({
      where: { broadcasterId },
    });

    if (restoreData) {
      await this.prisma.broadcasterAddress.create({
        data: restoreData,
      });
    }
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
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
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
    return broadcaster;
  }

  /** 방송인 broadcaster 삭제 */
  async deleteOne(email: string): Promise<boolean> {
    await this.prisma.broadcaster.delete({
      where: { email },
    });

    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
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
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
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
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
    return true;
  }

  /** 방송인 아바타 이미지 url null 로 초기화 */
  public async removeBroadcasterAvatar(email: Broadcaster['email']): Promise<boolean> {
    await this.prisma.broadcaster.update({
      where: { email },
      data: { avatar: null },
    });
    await this._clearCaches(this.#BROADCASTER_CACHE_KEY);
    return true;
  }

  /** 휴면 계정 데이터 복구 */
  public async restoreInactiveBroadcaster(
    email: Broadcaster['email'],
  ): Promise<Broadcaster> {
    const restoreData = await this.prisma.inactiveBroadcaster.findFirst({
      where: { email },
    });

    const restoreSocialData =
      await this.prisma.inactiveBroadcasterSocialAccount.findFirst({
        where: { broadcasterId: restoreData.id },
      });

    if (restoreSocialData) {
      await this.restoreInactiveSocialSeller(restoreSocialData);
    }

    return this.prisma.broadcaster.update({
      where: {
        id: restoreData.id,
      },
      data: {
        email: restoreData.email,
        userName: restoreData.userName,
        userNickname: restoreData.userNickname,
        overlayUrl: restoreData.overlayUrl,
        avatar: restoreData.avatar,
        password: restoreData.password,
        inactiveFlag: false,
      },
    });
  }

  /** 휴면 계정 데이터 삭제 */
  public async deleteInactiveBroadcaster(
    broadcasterId: Broadcaster['id'],
  ): Promise<InactiveBroadcaster> {
    return this.prisma.inactiveBroadcaster.delete({
      where: {
        id: broadcasterId,
      },
    });
  }

  private async restoreInactiveSocialSeller(
    restoreSocialData: BroadcasterSocialAccount,
  ): Promise<BroadcasterSocialAccount> {
    return this.prisma.broadcasterSocialAccount.create({
      data: restoreSocialData,
    });
  }
}
