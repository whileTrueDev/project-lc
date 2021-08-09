import { Controller, Get, Query } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  findOne(@Query('email') email: Seller['email']): Promise<Seller> {
    return this.sellerService.findOne({ email });
  }
}
