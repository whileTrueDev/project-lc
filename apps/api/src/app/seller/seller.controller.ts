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
import {
  FindSellerDto,
  SellerEmailDupCheckDto,
  SignUpSellerDto,
} from '@project-lc/shared-types';
import { MailVerificationService } from '../auth/mailVerification.service';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  // * 판매자 정보 조회
  @Get()
  public findOne(
    @Query(ValidationPipe) dto: FindSellerDto,
  ): Promise<Omit<Seller, 'password'>> {
    return this.sellerService.findOne({ email: dto.email });
  }

  // * 판매자 회원가입
  @Post()
  public async signUp(@Body(ValidationPipe) dto: SignUpSellerDto): Promise<Seller> {
    const checkResult = await this.mailVerificationService.checkMailVerification(
      dto.email,
      dto.code,
    );

    if (!checkResult) {
      throw new BadRequestException('인증코드가 올바르지 않습니다.');
    }
    const seller = await this.sellerService.signUp(dto);
    await this.mailVerificationService.deleteSuccessedMailVerification(checkResult.id);
    return seller;
  }

  // * 이메일 주소 중복 체크
  @Get('email-check')
  public async emailDupCheck(@Query(ValidationPipe) dto: SellerEmailDupCheckDto) {
    return this.sellerService.isEmailDupCheckOk(dto.email);
  }
}
