import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Seller } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from '@project-lc/prisma-orm';
import { BusinessRegistrationDto } from '@project-lc/shared-types';
import { UserPayload } from '../auth/auth.interface';
@Injectable()
export class SellerService {
  constructor(private readonly prisma: PrismaService) {}
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
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.SellerWhereUniqueInput): Promise<Seller> {
    const seller = await this.prisma.seller.findUnique({
      where: findInput,
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
      },
    });

    return seller;
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
  private async checkCanBeDeletedSeller(email: string) {
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
  }

  /**
   * seller 삭제
   */
  async deleteOne(email: string) {
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
  async checkPassword(email: string, password: string) {
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
  async changePassword(email: string, newPassword: string) {
    const hashedPw = await this.hashPassword(newPassword);
    const seller = await this.prisma.seller.update({
      where: { email },
      data: {
        password: hashedPw,
      },
    });
    return seller;
  }

  // 사업자 등록증 번호 포맷만들기
  makeRegistrationNumberFormat(num: string) {
    // 10자리의 문자열 -> '3-2-5'문자열
    return `${num.slice(0, 3)}-${num.slice(3, 5)}-${num.slice(5)}`;
  }

  /**
   * 사업자 등록증 등록
   * @param dto 사업자 등록증 등록 정보
   * @param sellerInfo 사용자 등록 정보
   */
  async insertBusinessRegistration(
    dto: BusinessRegistrationDto,
    sellerInfo: UserPayload,
  ) {
    const email = sellerInfo.sub;
    const businessRegistration = await this.prisma.sellerBusinessRegistration.create({
      data: {
        companyName: dto.companyName,
        sellerEmail: email,
        businessRegistrationNumber: this.makeRegistrationNumberFormat(
          dto.businessRegistrationNumber,
        ),
        representativeName: dto.representativeName,
        businessType: dto.businessType,
        businessItem: dto.businessItem,
        businessAddress: dto.businessAddress,
        taxInvoiceMail: dto.taxInvoiceMail,
        fileName: dto.fileName,
      },
    });

    return businessRegistration;
  }

  // 현재 사용자의 정산 정보
  async selectSellerSettlementInfo(sellerInfo: UserPayload) {
    const email = sellerInfo.sub;
    const settlementInfo = await this.prisma.seller.findUnique({
      where: {
        email,
      },
      select: {
        businessRegistration: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
        },
        sellerSettlements: {
          take: 5,
          orderBy: {
            id: 'desc',
          },
          select: {
            date: true,
            state: true,
            amount: true,
          },
        },
        sellerSettlementAccount: {
          take: 1,
          orderBy: {
            id: 'desc',
          },
          select: {
            bank: true,
            number: true,
            name: true,
          },
        },
      },
    });

    return settlementInfo;
  }
}
