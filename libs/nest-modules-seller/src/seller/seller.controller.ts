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
import {
  ConfirmHistory,
  SellCommission,
  Seller,
  SellerSettlementAccount,
} from '@prisma/client';
import {
  CacheClearKeys,
  HttpCacheInterceptor,
  SellerInfo,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MailVerificationService } from '@project-lc/nest-modules-mail-verification';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  BusinessRegistrationDto,
  ConfirmHistoryDto,
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
import { s3 } from '@project-lc/utils-s3';
import { SellerContactsService } from './seller-contacts.service';
import {
  SellerSettlementInfo,
  SellerSettlementInfoService,
} from './seller-settlement-info.service';
import { SellerShopService } from './seller-shop.service';
import { SellerService } from './seller.service';
import SellerSettlementService from './settlement/seller-settlement.service';

@Controller('seller')
@CacheClearKeys('seller')
export class SellerController {
  constructor(
    private readonly sellerService: SellerService,
    private readonly sellerSettlementInfoService: SellerSettlementInfoService,
    private readonly sellerSettlementService: SellerSettlementService,
    private readonly sellerShopService: SellerShopService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly sellerContactsService: SellerContactsService,
    private readonly prismaService: PrismaService,
  ) {}

  /** 판매자 정보 조회 */
  @Get()
  @UseInterceptors(HttpCacheInterceptor)
  public findOne(@Query(ValidationPipe) dto: FindSellerDto): Promise<FindSellerRes> {
    return this.sellerService.findOne({ email: dto.email });
  }

  /** 판매자 회원가입 */
  @Post()
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
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

  /** 판매자 이메일 주소 중복 체크 */
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.sellerService.isEmailDupCheckOk(dto.email);
  }

  /** 판매자 계정 삭제 */
  @UseGuards(JwtAuthGuard)
  @Delete()
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  public async deleteSeller(
    @Body('email') email: string,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<boolean> {
    if (email !== sellerInfo.sub) {
      throw new UnauthorizedException('본인의 계정이 아니면 삭제할 수 없습니다.');
    }
    return this.sellerService.deleteOne(email);
  }

  /** 판매자 비밀번호 확인 (로그인 이후, 정보수정 등 진행할 때 비밀번호 재확인용) */
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<boolean> {
    return this.sellerService.checkPassword(dto.email, dto.password);
  }

  /** 판매자 비밀번호 변경  */
  @Patch('password')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  public async changePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<Seller> {
    return this.sellerService.changePassword(dto.email, dto.password);
  }

  /** 로그인 한 판매자 본인의 정산정보 및 정산 검수 정보 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('settlement')
  @UseInterceptors(HttpCacheInterceptor)
  public async selectSellerSettlementInfo(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    return this.sellerSettlementInfoService.selectSellerSettlementInfo(sellerInfo);
  }

  /** 로그인 한 판매자 본인의 사업자 등록정보 등록 */
  @UseGuards(JwtAuthGuard)
  @Post('business-registration')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller/settlement')
  public async InsertBusinessRegistration(
    @Body(ValidationPipe) dto: BusinessRegistrationDto,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerBusinessRegistrationType> {
    // 사업자 등록정보 등록
    const sellerBusinessRegistration =
      await this.sellerSettlementInfoService.insertBusinessRegistration(dto, sellerInfo);

    // 사업자 등록정보 검수정보 등록
    const businessRegistrationConfirmation =
      await this.sellerSettlementInfoService.insertBusinessRegistrationConfirmation(
        sellerBusinessRegistration,
      );

    // 사업자 등록정보 결과
    const result = {
      ...sellerBusinessRegistration,
      BusinessRegistrationConfirmation: businessRegistrationConfirmation,
    };

    return result;
  }

  /** 로그인 한 판매자 본인의 계좌정보 등록 */
  @UseGuards(JwtAuthGuard)
  @Post('settlement-account')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller/settlement')
  public async InsertSettlementAccount(
    @Body(ValidationPipe) dto: SettlementAccountDto,
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlementAccount> {
    return this.sellerSettlementInfoService.insertSettlementAccount(dto, sellerInfo);
  }

  /** 로그인 한 판매자 본인의 정산정보 및 정산 검수 히스토리 조회 */
  @UseGuards(JwtAuthGuard)
  @Get('settlement/confirmation-history')
  @UseInterceptors(HttpCacheInterceptor)
  public async selectSellerSettlementHistory(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<ConfirmHistory[]> {
    return this.sellerSettlementInfoService.getSettlementConfirmHistory(sellerInfo);
  }

  /** 판매자 정산정보/계좌정보 검수 내역 생성 */
  @UseGuards(JwtAuthGuard)
  @Post('settlement/confirmation-history')
  public async InsertSettlementHistory(
    @Body(ValidationPipe) dto: ConfirmHistoryDto,
  ): Promise<ConfirmHistory> {
    return this.sellerSettlementInfoService.createSettlementConfirmHistory(dto);
  }

  /** 로그인 한 판매자 본인의 상점정보 변경 */
  @UseGuards(JwtAuthGuard)
  @Patch('shop-info')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  public async changeShopInfo(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
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

  /** 판매자 아바타 이미지 s3업로드 후 url 저장 */
  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  async addAvatar(
    @SellerInfo() seller: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    return this.sellerService.addSellerAvatar(seller.sub, file);
  }

  /** 판매자 아바타 이미지 null로 저장 */
  @Delete('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  async deleteAvatar(@SellerInfo() seller: UserPayload): Promise<boolean> {
    return this.sellerService.removeSellerAvatar(seller.sub);
  }

  /** 판매자 이용정보 동의여부 변경 */
  @Patch('agreement')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller')
  async updateAgreement(
    @Body(ValidationPipe) dto: SellerContractionAgreementDto,
  ): Promise<Seller> {
    return this.sellerService.updateAgreementFlag(dto);
  }

  /** 판매자 휴면계정 복구 */
  @Patch('restore')
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('seller/settlement')
  public async restoreInactiveSeller(@Body(ValidationPipe) dto): Promise<void> {
    try {
      await this.prismaService.$transaction(async (): Promise<void> => {
        const seller = await this.sellerService.restoreInactiveSeller(dto.email);
        Promise.all([
          await this.sellerSettlementInfoService.restoreInactiveBusinessRegistration(
            seller.id,
          ),

          await this.sellerSettlementInfoService
            .restoreInactiveBusinessRegistrationConfirmation(seller.id)
            .then((data) => {
              if (data) {
                this.sellerSettlementInfoService.deleteInactiveBusinessRegistrationConfirmation(
                  data.SellerBusinessRegistrationId,
                );
              }
            }),
          this.sellerContactsService.restoreSellerContacts(seller.id),
          this.sellerSettlementInfoService.restoreSettlementAccount(seller.id),

          s3.moveObjects(
            'inactive-business-registration',
            'business-registration',
            dto.email,
          ),
          s3.moveObjects('inactive-settlement-account', 'settlement-account', dto.email),
        ]).then(async () => {
          await this.sellerService.deleteInactiveSeller(seller.id);
        });
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
