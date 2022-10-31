import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Customer, CustomerAddress } from '@prisma/client';
import {
  CacheClearKeys,
  CustomerInfo,
  HttpCacheInterceptor,
  UserPayload,
} from '@project-lc/nest-core';
import { JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerAddressDto, CustomerAddressUpdateDto } from '@project-lc/shared-types';
import { CustomerAddressService } from './customer-address.service';

@Controller('customer/:customerId/address')
@UseInterceptors(HttpCacheInterceptor)
@CacheClearKeys('/address')
@UseGuards(JwtAuthGuard)
export class CustomerAddressController {
  constructor(private readonly customerAddressService: CustomerAddressService) {}

  /** 특정 소비자의 주소록 목록 조회 */
  @Get()
  findMany(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerAddress[]> {
    this.checkId(id, customerId);
    return this.customerAddressService.findMany(customerId);
  }

  /** 특정 소비자의 기본 주소 조회 */
  @Get('/default')
  findDefaultAddress(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerAddress> {
    this.checkId(id, customerId);
    return this.customerAddressService.findDefaultAddress(customerId);
  }

  /** 특정 소비자의 특정 주소록 조회 */
  @Get(':addressId')
  findOne(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @Param('addressId', ParseIntPipe) addressId: CustomerAddress['id'],
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerAddress> {
    this.checkId(id, customerId);
    return this.customerAddressService.findOne(addressId);
  }

  /** 특정 소비자의 주소록 생성 */
  @Post()
  create(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @Body(ValidationPipe) dto: CustomerAddressDto,
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerAddress> {
    this.checkId(id, customerId);
    return this.customerAddressService.create(customerId, dto);
  }

  /** 특정 소비자의 특정 주소록 수정 */
  @Patch(':addressId')
  update(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @Param('addressId', ParseIntPipe) addressId: CustomerAddress['id'],
    @Body(ValidationPipe) dto: CustomerAddressUpdateDto,
    @CustomerInfo() { id }: UserPayload,
  ): Promise<CustomerAddress> {
    this.checkId(id, customerId);
    return this.customerAddressService.update(addressId, dto);
  }

  /** 특정 소비자의 특정 주소록 삭제 */
  @Delete(':addressId')
  delete(
    @Param('customerId', ParseIntPipe) customerId: CustomerAddress['id'],
    @Param('addressId', ParseIntPipe) addressId: CustomerAddress['id'],
    @CustomerInfo() { id }: UserPayload,
  ): Promise<boolean> {
    this.checkId(id, customerId);
    return this.customerAddressService.delete(addressId);
  }

  /** 소비자 본인 데이터에 대한 요청인지 확인, 본인이 아닌경우 에러 반환 */
  private checkId(id: Customer['id'], customerId: Customer['id']): void {
    if (id !== customerId)
      throw new ForbiddenException('id and customerId does not match');
  }
}
