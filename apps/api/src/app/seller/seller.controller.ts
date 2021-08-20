import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { Seller } from '@prisma/client';
import {
  FindSellerDto,
  PasswordValidateDto,
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
  public findOne(@Query(ValidationPipe) dto: FindSellerDto): Promise<Seller> {
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
    await this.mailVerificationService.deleteSuccessedMailVerification(dto.email);
    return seller;
  }

  // * 이메일 주소 중복 체크
  @Get('email-check')
  public async emailDupCheck(@Query(ValidationPipe) dto: SellerEmailDupCheckDto) {
    return this.sellerService.isEmailDupCheckOk(dto.email);
  }

  // 판매자 계정 삭제(id 제외한 값 null로 변경)
  @Delete()
  public async deleteSeller(@Body('email') email: string) {
    return this.sellerService.deleteOne(email);
  }

  // 로그인 한 사람이 본인인증을 위해 비밀번호 확인
  // TODO: jwt guard 적용하기, 비밀번호 변경 & 기타 본인인증 시 적용?????
  @Post('validate-password')
  public async validatePassword(@Body(ValidationPipe) dto: PasswordValidateDto) {
    return this.sellerService.checkPassword(dto.email, dto.password);
  }
}
