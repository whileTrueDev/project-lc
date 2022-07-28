import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { KkshowSubNavLink } from '@prisma/client';
import { CreateKkshowSubNavDto } from '@project-lc/shared-types';
import { KkshowSubNavService } from './kkshow-subnav.service';

@Controller('kkshow-subnav')
export class KkshowSubNavController {
  constructor(private readonly kkshowSubNavService: KkshowSubNavService) {}

  @Get()
  findAll(): Promise<KkshowSubNavLink[]> {
    return this.kkshowSubNavService.findAll();
  }

  @Post()
  create(
    @Body(new ValidationPipe({ transform: true })) dto: CreateKkshowSubNavDto,
  ): Promise<KkshowSubNavLink> {
    return this.kkshowSubNavService.add(dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return this.kkshowSubNavService.remove(id);
  }
}
