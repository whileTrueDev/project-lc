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
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { CacheClearKeys, HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
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
    const newCustomer = this.customerService.signUp(dto);
    await this.mailVerificationService.deleteSuccessedMailVerification(dto.email);
    return newCustomer;
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

  @UseInterceptors(HttpCacheInterceptor)
  @Delete(':customerId')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('customerId', ParseIntPipe) id: number): Promise<boolean> {
    return this.customerService.deleteOne(id);
  }
}
