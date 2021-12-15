import { Injectable } from '@nestjs/common';
import { PrismaService } from '@project-lc/prisma-orm';

@Injectable()
export class InquiryService {
  constructor(private readonly prisma: PrismaService) {}
}
