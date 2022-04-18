import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { AdminGuard } from '@project-lc/nest-modules-authguard';
import { CustomerService } from '@project-lc/nest-modules-customer';
import { FindManyDto } from '@project-lc/shared-types';

@UseGuards(AdminGuard)
@Controller('admin/customer')
export class AdminCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(
    @Query() dto: FindManyDto,
    @Query('orderBy') orderBy: string,
    @Query('orderByColumn') orderByColumn: keyof Customer,
  ): Promise<Customer[]> {
    const _take = Number(dto.take);
    const _skip = Number(dto.skip);
    const _orderBy = ['desc', 'asc'].includes(orderBy.toLowerCase())
      ? orderBy
      : undefined;
    const keys: Array<keyof Customer> = [
      'id',
      'name',
      'password',
      'email',
      'nickname',
      'phone',
      'createDate',
      'gender',
      'birthDate',
      'agreementFlag',
      'inactiveFlag',
    ];
    const _orderByColumn: keyof Customer = keys.includes(orderByColumn)
      ? orderByColumn
      : undefined;

    return this.customerService.findAll({
      take: Number.isNaN(_take) ? undefined : _take,
      skip: Number.isNaN(_skip) ? undefined : _skip,
      orderBy: _orderByColumn ? { [_orderByColumn]: _orderBy } : undefined,
    });
  }
}
