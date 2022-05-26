import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Customer } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerService } from '@project-lc/nest-modules-customer';
import { FindManyDto, CustomerIncludeDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/customer')
export class AdminCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(
    @Query() dto: FindManyDto,
    @Query('orderBy') orderBy: string,
    @Query('orderByColumn') orderByColumn: keyof Customer,
    @Query('include') include: CustomerIncludeDto,
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

    const _include = include;

    return this.customerService.findAll({
      take: Number.isNaN(_take) ? undefined : _take,
      skip: Number.isNaN(_skip) ? undefined : _skip,
      orderBy: _orderByColumn ? { [_orderByColumn]: _orderBy } : undefined,
      include: JSON.parse(`${_include}`) || undefined,
    });
  }
}
