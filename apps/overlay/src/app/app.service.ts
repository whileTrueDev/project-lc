import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // * prisma 데이터베이스 접근 호출 예시 by Dan -> 예시 확인 이후 삭제해도 됩니다.
  async getHello(): Promise<string> {
    // * -> 예시 확인 이후 삭제해도 됩니다.
    // app.module에서 PrismaModule을 import 하였으므로, 현재 사용 prismaService 가능합니다.
    // import한 prismaService 을 통해 DB 모델에 접근.
    const data = await this.prisma.seller.findFirst({
      select: {
        email: true,
        name: true,
      },
      where: { email: 'test@test.com' },
    });

    if (!data) return 'Hello World!';
    return data.name;
  }

  async doSomething(): Promise<{ message: string }> {
    return { message: 'Welcome to socket!' };
  }
}
