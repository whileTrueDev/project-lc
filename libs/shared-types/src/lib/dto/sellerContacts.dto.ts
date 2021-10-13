import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class SellerContactsDTO {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  isDefault: boolean;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type SubPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type SellerContactsDTOWithoutIdDTO = SubPartial<SellerContactsDTO, 'id'>;
