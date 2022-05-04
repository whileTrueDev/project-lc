import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateReturnDto,
  CreateReturnRes,
  GetReturnListDto,
  ReturnDetailRes,
  ReturnListRes,
} from '@project-lc/shared-types';
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

  /** 특정 반품요청 상세 조회 */
  @Get(':returnId')
  getReturnDetail(@Param('returnId', ParseIntPipe) id: number): Promise<ReturnDetailRes> {
    return this.returnService.getReturnDetail(id);
  }

  /** 반품요청 내역 조회 */
  @Get()
  getReturnList(
    @Query(new ValidationPipe({ transform: true })) dto: GetReturnListDto,
  ): Promise<ReturnListRes> {
    return this.returnService.getReturnList(dto);
  }
}
