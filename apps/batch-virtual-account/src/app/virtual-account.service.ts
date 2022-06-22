import { Injectable } from '@nestjs/common';
import { PaymentMethod } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class VirtualAccountService {
  constructor(private readonly prisma: PrismaService) {}

  public async findTagets(): Promise<void> {
    this.prisma.orderPayment.findMany({
      where: {
        depositDoneFlag: false,
        method: PaymentMethod.virtualAccount,
      },
    });
  }
}

export default VirtualAccountService;
