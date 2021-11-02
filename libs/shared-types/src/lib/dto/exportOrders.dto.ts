import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ExportOrderDto } from './exportOrder.dto';

export class ExportOrdersDto {
  @IsArray()
  @ValidateNested()
  @Type(() => ExportOrderDto)
  exportOrders: ExportOrderDto[];
}
