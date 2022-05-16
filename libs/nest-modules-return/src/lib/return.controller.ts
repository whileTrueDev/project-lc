import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { HttpCacheInterceptor } from '@project-lc/nest-core';
import {
  CreateReturnDto,
  CreateReturnRes,
  DeleteReturnRes,
  GetReturnListDto,
  ReturnDetailRes,
  ReturnListRes,
  UpdateReturnDto,
  UpdateReturnRes,
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
  @Get(':returnCode')
  getReturnDetail(@Param('returnCode') returnCode: string): Promise<ReturnDetailRes> {
    return this.returnService.getReturnDetail(returnCode);
  }

  /** 반품요청 내역 조회 */
  @Get()
  getReturnList(
    @Query(new ValidationPipe({ transform: true })) dto: GetReturnListDto,
  ): Promise<ReturnListRes> {
    return this.returnService.getReturnList(dto);
  }

  /** 반품요청 상태 변경(판매자 혹은 관리자가 진행) */
  @Patch(':returnId')
  updateReturnStatus(
    @Param('returnId', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateReturnDto,
  ): Promise<UpdateReturnRes> {
    return this.returnService.updateReturnStatus(id, dto);
  }

  /** 반품요청 삭제 */
  @Delete(':returnId')
  deleteReturn(@Param('returnId', ParseIntPipe) id: number): Promise<DeleteReturnRes> {
    return this.returnService.deleteReturn(id);
  }
}
