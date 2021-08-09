import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { SignUpSellerDto } from '@project-lc/shared-types';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  findOne(@Query('email') email: Seller['email']): Promise<Seller> {
    return this.sellerService.findOne({ email });
  }

  @Post()
  signUp(@Body(ValidationPipe) dto: SignUpSellerDto): Promise<Seller> {
    return this.sellerService.signUp(dto);
  }
}
