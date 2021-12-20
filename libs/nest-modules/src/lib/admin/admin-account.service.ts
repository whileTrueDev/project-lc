import { UnauthorizedException, Injectable } from '@nestjs/common';
import { Prisma, Administrator } from '@prisma/client';
import { hash, verify } from 'argon2';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class AdminAccountService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.administrator.findFirst({ where: { email } });
    if (user) return false;
    return true;
  }

  /**
   * 회원 가입
   */
  async signUp(signUpInput: Prisma.AdministratorCreateInput): Promise<Administrator> {
    const hashedPw = await this.hashPassword(signUpInput.password);
    const administrator = await this.prisma.administrator.create({
      data: {
        email: signUpInput.email,
        password: hashedPw,
      },
    });
    return administrator;
  }

  /**
   * 유저 정보 조회
   */
  async findOne(findInput: Prisma.AdministratorWhereUniqueInput): Promise<Administrator> {
    const administrator = await this.prisma.administrator.findUnique({
      where: findInput,
    });
    return administrator;
  }

  /**
   * 로그인
   */
  async login(email: string, pwdInput: string): Promise<Administrator | null> {
    const user = await this.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCorrect = await this.validatePassword(pwdInput, user.password);
    if (!isCorrect) {
      throw new UnauthorizedException();
    }
    return user;
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
}
