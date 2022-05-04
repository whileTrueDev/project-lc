import {
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import { CreateReturnDto, CreateReturnRes } from '@project-lc/shared-types';
import { ReturnService } from './return.service';

@UseInterceptors(HttpCacheInterceptor)
@Controller('return')
export class ReturnController {
  constructor(private readonly returnService: ReturnService) {}

  /** 반품요청 생성 */
  @Post()
  createReturn(@Body(ValidationPipe) dto: CreateReturnDto): Promise<CreateReturnRes> {
    return this.returnService.createReturn(dto);
  }
}
