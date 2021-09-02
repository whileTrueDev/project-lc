import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Seller } from '@prisma/client';
import {
  FindSellerDto,
  PasswordValidateDto,
  SellerEmailDupCheckDto,
  SignUpSellerDto,
  BusinessRegistrationDto,
} from '@project-lc/shared-types';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { MailVerificationService } from '../auth/mailVerification.service';
import { SellerService } from './seller.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';

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

  // 판매자 계정 삭제
  @UseGuards(JwtAuthGuard)
  @Delete()
  public async deleteSeller(
    @Body('email') email: string,
    @SellerInfo() sellerInfo: UserPayload,
  ) {
    if (email !== sellerInfo.sub) {
      throw new UnauthorizedException('본인의 계정이 아니면 삭제할 수 없습니다.');
    }
    return this.sellerService.deleteOne(email);
  }

  // 로그인 한 사람이 본인인증을 위해 비밀번호 확인
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(@Body(ValidationPipe) dto: PasswordValidateDto) {
    return this.sellerService.checkPassword(dto.email, dto.password);
  }

  // 비밀번호 변경
  @Patch('password')
  public async changePassword(@Body(ValidationPipe) dto: PasswordValidateDto) {
    return this.sellerService.changePassword(dto.email, dto.password);
  }

  // 본인의 사업자 등록증 등록
  @UseGuards(JwtAuthGuard)
  @Post('business-registration')
  public async InsertBusinessRegistration(
    @Body(ValidationPipe) dto: BusinessRegistrationDto,
    @SellerInfo() sellerInfo: UserPayload,
  ) {
    return this.sellerService.insertBusinessRegistration(dto, sellerInfo);
  }

  // 본인의 사업자 등록증 조회
  @UseGuards(JwtAuthGuard)
  @Get('settlement')
  public async selectSellerSettlementInfo(@SellerInfo() sellerInfo: UserPayload) {
    return this.sellerService.selectSellerSettlementInfo(sellerInfo);
  }
}
