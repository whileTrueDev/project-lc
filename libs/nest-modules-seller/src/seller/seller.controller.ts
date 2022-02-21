import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SellCommission, Seller, SellerSettlementAccount } from '@prisma/client';
import { HttpCacheInterceptor, SellerInfo, UserPayload } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MailVerificationService } from '@project-lc/nest-modules-mail';
import {
  BusinessRegistrationDto,
  EmailDupCheckDto,
  FindSellerDto,
  FindSellerRes,
  PasswordValidateDto,
  SellerBusinessRegistrationType,
  SellerContractionAgreementDto,
  SellerShopInfoDto,
  SettlementAccountDto,
  SignUpDto,
} from '@project-lc/shared-types';
import {
  SellerSettlementInfo,
  SellerSettlementService,
} from './seller-settlement.service';
import { SellerShopService } from './seller-shop.service';
import { SellerService } from './seller.service';
@Controller('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly sellerSettlementService: SellerSettlementService,
    private readonly sellerShopService: SellerShopService,
    private readonly mailVerificationService: MailVerificationService,
  ) {}

  // * 판매자 정보 조회
  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  public findOne(@Query(ValidationPipe) dto: FindSellerDto): Promise<FindSellerRes> {
    return this.sellerService.findOne({ email: dto.email });
  }

  // * 판매자 회원가입
  @Post()
  public async signUp(@Body(ValidationPipe) dto: SignUpDto): Promise<Seller> {
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
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.sellerService.isEmailDupCheckOk(dto.email);
  }

  // 판매자 계정 삭제
  @UseGuards(JwtAuthGuard)
  @Delete()
  public async deleteSeller(
    @Body('email') email: string,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<boolean> {
    if (email !== sellerInfo.sub) {
      throw new UnauthorizedException('본인의 계정이 아니면 삭제할 수 없습니다.');
    }
    return this.sellerService.deleteOne(email);
  }

  // 로그인 한 사람이 본인인증을 위해 비밀번호 확인
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<boolean> {
    return this.sellerService.checkPassword(dto.email, dto.password);
  }

  // 비밀번호 변경
  @Patch('password')
  public async changePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<Seller> {
    return this.sellerService.changePassword(dto.email, dto.password);
  }

  // 본인의 정산정보 및 정산 검수 정보 조회
  @UseGuards(JwtAuthGuard)
  @Get('settlement')
  @UseInterceptors(HttpCacheInterceptor)
  public async selectSellerSettlementInfo(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    return this.sellerSettlementService.selectSellerSettlementInfo(sellerInfo);
  }

  // 본인의 사업자 등록정보 등록
  @UseGuards(JwtAuthGuard)
  @Post('business-registration')
  public async InsertBusinessRegistration(
    @Body(ValidationPipe) dto: BusinessRegistrationDto,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerBusinessRegistrationType> {
    // 사업자 등록정보 등록
    const sellerBusinessRegistration =
      await this.sellerSettlementService.insertBusinessRegistration(dto, sellerInfo);

    // 사업자 등록정보 검수정보 등록
    const businessRegistrationConfirmation =
      await this.sellerSettlementService.insertBusinessRegistrationConfirmation(
        sellerBusinessRegistration,
      );

    // 사업자 등록정보 결과
    const result = {
      ...sellerBusinessRegistration,
      BusinessRegistrationConfirmation: businessRegistrationConfirmation,
    };

    return result;
  }

  // 본인의 계좌정보 등록
  @UseGuards(JwtAuthGuard)
  @Post('settlement-account')
  public async InsertSettlementAccount(
    @Body(ValidationPipe) dto: SettlementAccountDto,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlementAccount> {
    return this.sellerSettlementService.insertSettlementAccount(dto, sellerInfo);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('shop-info')
  public async changeShopInfo(
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    dto: SellerShopInfoDto,
    @SellerInfo() sellerInfo: UserPayload,
    @Res() res,
  ): Promise<void> {
    try {
      await this.sellerShopService.changeShopInfo(dto, sellerInfo);
      res.sendStatus(204);
    } catch (e) {
      res.sendStatus(500);
    }
  }

  /** 판매자 판매 수수료 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('sell-commission')
  @UseInterceptors(HttpCacheInterceptor)
  public findSellCommission(): Promise<SellCommission> {
    return this.sellerSettlementService.findSellCommission();
  }

  /** 셀러 아바타 이미지 s3업로드 후 url 저장 */
  @UseGuards(JwtAuthGuard)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @SellerInfo() seller: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    return this.sellerService.addSellerAvatar(seller.sub, file);
  }

  /** 셀러 아바타 이미지 null로 저장 */
  @UseGuards(JwtAuthGuard)
  @Delete('/avatar')
  async deleteAvatar(@SellerInfo() seller: UserPayload): Promise<boolean> {
    return this.sellerService.removeSellerAvatar(seller.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('agreement')
  async updateAgreement(
    @Body(ValidationPipe) dto: SellerContractionAgreementDto,
  ): Promise<Seller> {
    return this.sellerService.updateAgreementFlag(dto);
  }
}
