import { IsNumber } from 'class-validator';
import { CustomerMileageLogDto } from './customerMileageLog.dto';

export class CustomerMileageDto {
  @IsNumber()
  customerId: number;

  @IsNumber()
  mileage: number;
}

export type UpsertDto = CustomerMileageDto & CustomerMileageLogDto;
