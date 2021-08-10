import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Seller } from '@prisma/client';
import { FindSellerDto, SignUpSellerDto } from '@project-lc/shared-types';
import { MailVerificationService } from '../auth/mailVerification.service';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  @Get()
  public findOne(
    @Query(ValidationPipe) dto: FindSellerDto,
  ): Promise<Omit<Seller, 'password'>> {
    return this.sellerService.findOne({ email: dto.email });
  }

  @Post()
  public async signUp(@Body(ValidationPipe) dto: SignUpSellerDto): Promise<Seller> {
    const checkResult = await this.mailVerificationService.checkMailVerification(
      dto.email,
      dto.code,
    );

    if (!checkResult) {
      throw new BadRequestException('verification code is not correct');
    }
    return this.sellerService.signUp(dto);
  }
}
