import { BadRequestException, Injectable } from '@nestjs/common';
import { Customer, CustomerAddress } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { CustomerAddressDto, CustomerAddressUpdateDto } from '@project-lc/shared-types';

@Injectable()
export class CustomerAddressService {
  constructor(private readonly prisma: PrismaService) {}

  /** 특정 주소록 조회 */
  public async findOne(addressId: CustomerAddress['id']): Promise<CustomerAddress> {
    return this.prisma.customerAddress.findUnique({ where: { id: addressId } });
  }

  /** 기본 배송지 조회 */
  public async findDefaultAddress(customerId: Customer['id']): Promise<CustomerAddress> {
    return this.prisma.customerAddress.findFirst({
      where: { customerId, isDefault: true },
    });
  }

  /** 특정 소비자의 주소록 목록 조회 */
  public async findMany(customerId: Customer['id']): Promise<CustomerAddress[]> {
    return this.prisma.customerAddress.findMany({ where: { customerId } });
  }

  /** 특정 소비자 주소록 생성 */
  public async create(
    customerId: Customer['id'],
    dto: CustomerAddressDto,
  ): Promise<CustomerAddress> {
    const howMany = await this.prisma.customerAddress.count({ where: { customerId } });
    if (howMany >= 3) throw new BadRequestException("can't create more than 3 address");
    return this.prisma.customerAddress.create({ data: { customerId, ...dto } });
  }

  /** 특정 주소록 수정 */
  public async update(
    addressId: CustomerAddress['id'],
    dto: CustomerAddressUpdateDto,
  ): Promise<CustomerAddress> {
    return this.prisma.customerAddress.update({
      where: { id: addressId },
      data: dto,
    });
  }

  /** 특정 주소록 삭제 */
  public async delete(addressId: CustomerAddress['id']): Promise<boolean> {
    const result = await this.prisma.customerAddress.delete({ where: { id: addressId } });
    return !!result;
  }
}
