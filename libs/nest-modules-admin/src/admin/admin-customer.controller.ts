import {
  CacheInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { Customer } from '@prisma/client';
import { AdminGuard, JwtAuthGuard } from '@project-lc/nest-modules-authguard';
import { CustomerService } from '@project-lc/nest-modules-customer';
import { FindCustomerDto } from '@project-lc/shared-types';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/customer')
@UseInterceptors(CacheInterceptor)
export class AdminCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(
    @Query(new ValidationPipe({ transform: true })) dto: FindCustomerDto,
  ): Promise<Customer[]> {
    const _take = Number(dto.take);
    const _skip = Number(dto.skip);
    const _include = dto.includeOpts;
    return this.customerService.findAll({
      take: Number.isNaN(_take) ? undefined : _take,
      skip: Number.isNaN(_skip) ? undefined : _skip,
      orderBy: dto.orderByColumn ? { [dto.orderByColumn]: dto.orderBy } : undefined,
      include: _include || undefined,
    });
  }
}
