import { IsString } from 'class-validator';

export class BroadcasterAddressDto {
  @IsString() postalCode: string;
  @IsString() address: string;
  @IsString() detailAddress: string;
}
