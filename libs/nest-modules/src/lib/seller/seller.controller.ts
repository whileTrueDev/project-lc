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
  Res,
} from '@nestjs/common';
import {
  SellCommission,
  Seller,
  SellerSettlementAccount,
  SellerSettlements,
} from '@prisma/client';
import {
  FindSellerDto,
  PasswordValidateDto,
  SellerEmailDupCheckDto,
  SignUpSellerDto,
  BusinessRegistrationDto,
  SettlementAccountDto,
  SellerShopInfoDto,
  FindSellerRes,
  SellerContactsDTO,
  SellerContactsDTOWithoutIdDTO,
  SellerBusinessRegistrationType,
} from '@project-lc/shared-types';
import { JwtAuthGuard } from '../_nest-units/guards/jwt-auth.guard';
import { MailVerificationService } from '../auth/mailVerification.service';
import { SellerService } from './seller.service';
import {
  SellerSettlementInfo,
  SellerSettlementService,
} from './seller-settlement.service';
import { SellerInfo } from '../_nest-units/decorators/sellerInfo.decorator';
import { UserPayload } from '../auth/auth.interface';
import { SellerShopService } from './seller-shop.service';

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
  public findOne(@Query(ValidationPipe) dto: FindSellerDto): Promise<FindSellerRes> {
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
  public async emailDupCheck(
    @Query(ValidationPipe) dto: SellerEmailDupCheckDto,
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
  public async selectSellerSettlementInfo(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlementInfo> {
    return this.sellerSettlementService.selectSellerSettlementInfo(sellerInfo);
  }

  // 본인의 정산 대상 목록 조회
  @UseGuards(JwtAuthGuard)
  @Get('settlement-history')
  public async ㅁㄴㅇㄹ(
    @SellerInfo() sellerInfo: UserPayload,
  ): Promise<SellerSettlements[]> {
    return this.sellerSettlementService.findSettlementHistory(sellerInfo);
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

  @UseGuards(JwtAuthGuard)
  @Get('contacts')
  public findDefaultContacts(@Query('email') email: string): Promise<SellerContactsDTO> {
    return this.sellerService.findDefaultContacts(email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('contacts')
  public createContacts(
    @SellerInfo() seller: UserPayload,
    @Body(ValidationPipe) dto: SellerContactsDTOWithoutIdDTO,
  ): Promise<{ contactId: number }> {
    const email = seller.sub;
    return this.sellerService.registSellerContacts(email, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('sell-commission')
  public findSellCommission(): Promise<SellCommission> {
    return this.sellerSettlementService.findSellCommission();
  }
}
