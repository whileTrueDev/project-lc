import { IsNumber } from 'class-validator';

export class DeleteGoodsDto {
  @IsNumber({}, { each: true }) // {isnumberOptions},{validateOptions}
  ids: number[];
}
