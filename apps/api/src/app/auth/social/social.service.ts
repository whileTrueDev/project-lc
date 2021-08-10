import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class SocialService {
  constructor(private readonly prisma: PrismaService) {}

  public async findSellerWithEmail(email: string) {
    const row = await this.prisma.seller.findUnique({ where: { email } });
    return row;
  }

  /** 구글 로그인 */
  async googleLogin(req) {
    if (!req.user) {
      // 해당 구글 계정이 없음(에러)
      return 'No user from google';
    }

    console.log({ reqUser: req.user });
    // 동일 email로 가입된 계정이 있는지 확인
    const existSeller = await this.findSellerWithEmail(req.user.email);
    console.log({ existSeller });

    // 구글 계정으로 가입한것이면 로그인처리(토큰발급 & 저장)
    // 구글 계정이 아니면 구글 계정으로 로그인 유도(에러)

    // 해당 email로 가입된 계정이 존재하지않으면
    // 구글계정으로 가입(회원가입) -> 로그인처리(토큰발급 & 저장)
    return {
      message: 'User information from google',
      user: req.user,
    };
  }
}
