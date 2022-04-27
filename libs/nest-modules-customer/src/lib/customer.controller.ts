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
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { MailVerificationService } from '@project-lc/nest-modules-mail-verification';
import { EmailDupCheckDto, SignUpDto, UpdateCustomerDto } from '@project-lc/shared-types';
import { CustomerService } from './customer.service';

@Controller('customer')
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

  /** 소비자 수정 */
  @Patch(':customerId')
  @Put(':customerId')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('customerId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.customerService.update(id, dto);
  }

  @Delete(':customerId')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('customerId', ParseIntPipe) id: number): Promise<boolean> {
    return this.customerService.deleteOne(id);
  }
}
