import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Customer } from '@prisma/client';
import {
  CacheClearKeys,
  CustomerInfo,
  HttpCacheInterceptor,
  UserPayload,
} from '@project-lc/nest-core';
import * as __multer from 'multer';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerCouponService } from '@project-lc/nest-modules-coupon';
import { MailVerificationService } from '@project-lc/nest-modules-mail-verification';
import {
  CustomerStatusRes,
  EmailDupCheckDto,
  PasswordValidateDto,
  SignUpDto,
  UpdateCustomerDto,
} from '@project-lc/shared-types';
import { CustomerService } from './customer.service';

@Controller('customer')
@CacheClearKeys('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly mailVerificationService: MailVerificationService,
    private readonly customerCouponService: CustomerCouponService,
  ) {}

  // * 이메일 주소 중복 체크
  @Get('email-check')
  public async emailDupCheck(
    @Query(ValidationPipe) dto: EmailDupCheckDto,
  ): Promise<boolean> {
    return this.customerService.isEmailDupCheckOk(dto.email);
  }

  /** 소비자 마이페이지 홈에 표시될 정보(팔로잉, 배송중 상품 수 등) 조회 */
  @Get('status')
  async getCustomerStatus(
    @Query('customerId', ParseIntPipe) customerId: number,
  ): Promise<CustomerStatusRes> {
    return this.customerService.getCustomerStatus({ customerId });
  }

  /** 소비자 생성 */
  @Post()
  async signUp(@Body(ValidationPipe) dto: SignUpDto): Promise<Customer> {
    const checkResult = await this.mailVerificationService.checkMailVerification(
      dto.email,
      dto.code,
    );
    if (!checkResult) throw new BadRequestException('인증코드가 올바르지 않습니다.');
    const newCustomer = await this.customerService.signUp(dto);
    await this.mailVerificationService.deleteSuccessedMailVerification(dto.email);

    // 회원가입 할인쿠폰 발급
    try {
      await this.customerCouponService.createCustomerWelcomeCoupon(newCustomer.id);
    } catch (err) {
      console.error(`회원가입 웰컴쿠폰 발급 실패 - ${err}`);
    }
    return newCustomer;
  }

  /** 소비자 비밀번호 맞는지 확인 */
  @UseGuards(JwtAuthGuard)
  @Post('validate-password')
  public async validatePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<boolean> {
    return this.customerService.checkPassword(dto.email, dto.password);
  }

  /** 1명의 소비자 정보 조회 */
  @Get(':customerId')
  @UseInterceptors(HttpCacheInterceptor)
  findOne(@Param('customerId', ParseIntPipe) id: number): Promise<Customer> {
    return this.customerService.findOne({ id });
  }

  // 비밀번호 변경
  @Patch('password')
  @UseInterceptors(HttpCacheInterceptor)
  public async changePassword(
    @Body(ValidationPipe) dto: PasswordValidateDto,
  ): Promise<Customer> {
    return this.customerService.changePassword(dto.email, dto.password);
  }

  /** 소비자 수정 */
  @UseInterceptors(HttpCacheInterceptor)
  @Patch(':customerId')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('customerId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, dto);
  }

  /** 소비자 아바타 이미지 s3업로드 후 url 저장 */
  @Post('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('customer')
  async addCustomerAvatar(
    @CustomerInfo() customer: UserPayload,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<boolean> {
    return this.customerService.addCustomerAvatar(customer.sub, file);
  }

  /** 소비자 아바타 이미지 null로 저장 */
  @Delete('/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(HttpCacheInterceptor)
  @CacheClearKeys('customer')
  async deleteCustomerAvatar(@CustomerInfo() customer: UserPayload): Promise<boolean> {
    return this.customerService.removeCustomerAvatar(customer.sub);
  }

  /** 소비자 계정 삭제 */
  @UseInterceptors(HttpCacheInterceptor)
  @Delete(':customerId')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('customerId', ParseIntPipe) id: number): Promise<boolean> {
    return this.customerService.deleteOne(id);
  }
}
