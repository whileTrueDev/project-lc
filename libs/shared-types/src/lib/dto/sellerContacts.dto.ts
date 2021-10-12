import { IsString, IsBoolean } from 'class-validator';

export class SellerContactsDTO {
  @IsString()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsBoolean()
  isDefault: boolean;
}
