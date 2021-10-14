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

export type SellerContactsDTOWithoutIdDTO = Omit<SellerContactsDTO, 'id'>;
