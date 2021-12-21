import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma, Seller } from '@prisma/client';
import { hash, verify } from 'argon2';
import { FindSellerRes, SellerContactsDTO } from '@project-lc/shared-types';
import { PrismaService } from '@project-lc/prisma-orm';
import __multer from 'multer';
import { S3Service } from '../s3/s3.service';
@Injectable()
export class SellerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
  ) {}

  /**
   * 회원 가입
   */
  async signUp(signUpInput: Prisma.SellerCreateInput): Promise<Seller> {
    const hashedPw = await this.hashPassword(signUpInput.password);
    const seller = await this.prisma.seller.create({
      data: {
        email: signUpInput.email,
        name: signUpInput.name,
        password: hashedPw,
      },
    });
    return seller;
  }

  /**
   * 로그인
   */
  async login(email: string, pwdInput: string): Promise<Seller | null> {
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
  async findOne(findInput: Prisma.SellerWhereUniqueInput): Promise<FindSellerRes> {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        avatar: true,
        sellerShop: {
          select: {
            shopName: true,
          },
        },
      },
    });

    if (!seller) {
      return seller;
    }
    // seller shop name preprocessing
    const { sellerShop, ..._seller } = seller;
    return {
      ..._seller,
      shopName: sellerShop?.shopName ? sellerShop.shopName : null,
    };
  }

  /**
   * 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.seller.findFirst({ where: { email } });
    if (user) return false;
    return true;
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
   * 해당 이메일로 가입된 계정이 삭제될 수 있는지 확인함
   * @throws {Error}
   */
  private async checkCanBeDeletedSeller(email: string): Promise<boolean> {
    const seller = await this.prisma.seller.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: false,
        socialAccounts: true,
      },
    });

    if (!seller) {
      throw new BadRequestException('해당 계정이 존재하지 않습니다.');
    }

    if (seller.socialAccounts.length !== 0) {
      throw new BadRequestException(
        '연결된 소셜 계정이 존재합니다. 연결 해제를 먼저 진행해주세요.',
      );
    }

    return !!seller;
  }

  /**
   * seller 삭제
   */
  async deleteOne(email: string): Promise<boolean> {
    await this.checkCanBeDeletedSeller(email);

    await this.prisma.seller.delete({
      where: { email },
    });

    return true;
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
   * 비밀번호 변경
   * @param email 비밀번호 변경할 셀러의 email
   * @param newPassword 새로운 비밀번호
   * @returns
   */
  async changePassword(email: string, newPassword: string): Promise<Seller> {
    const hashedPw = await this.hashPassword(newPassword);
    const seller = await this.prisma.seller.update({
      where: { email },
      data: {
        password: hashedPw,
      },
    });
    return seller;
  }

  /** 판매자의 기본 연락처 */
  async findDefaultContacts(email: string): Promise<SellerContactsDTO> {
    const userId = await this.prisma.seller.findFirst({
      where: { email },
      select: {
        id: true,
      },
    });

    const sellerDefaultContacts = await this.prisma.sellerContacts.findFirst({
      where: { sellerId: userId.id, isDefault: true },
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        isDefault: true,
      },
      orderBy: {
        createDate: 'desc',
      },
    });

    return sellerDefaultContacts;
  }

  async registSellerContacts(sellerEmail, dto): Promise<{ contactId: number }> {
    const contact = await this.prisma.sellerContacts.create({
      data: {
        seller: { connect: { email: sellerEmail } },
        email: dto.email,
        phoneNumber: dto.phoneNumber,
        isDefault: dto.isDefault ? true : undefined,
      },
    });
    return { contactId: contact.id };
  }

  /** 셀러 아바타 이미지 url 저장 */
  public async addSellerAvatar(
    email: Seller['email'],
    file: Express.Multer.File,
  ): Promise<boolean> {
    const avatarUrl = await this.s3service.uploadProfileImage({
      key: file.originalname,
      file: file.buffer,
      email,
      userType: 'seller',
    });
    await this.prisma.seller.update({
      where: { email },
      data: { avatar: avatarUrl },
    });
    return true;
  }

  /** 셀러 아바타 이미지 url null 로 초기화 */
  public async removeSellerAvatar(email: Seller['email']): Promise<boolean> {
    await this.prisma.seller.update({
      where: { email },
      data: { avatar: null },
    });
    return true;
  }
}
