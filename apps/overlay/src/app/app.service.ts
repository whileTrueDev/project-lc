import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async doSomething(): Promise<{ message: string }> {
    // this.prismaService.user.findFirst();
    return { message: 'Welcome to socket!' };
  }
}
