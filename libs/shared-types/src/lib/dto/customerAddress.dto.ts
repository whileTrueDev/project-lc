import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CustomerAddressDto {
  @IsString() title: string; // 주소록 별칭
  @IsString() recipient: string; // 수령인
  @IsString() address: string; // 주소 (도로명)
  @IsString() detailAddress: string; // 주소 상세
  @IsString() postalCode: string; // 우편 번호
  @IsBoolean() isDefault: boolean; // 기본주소지 여부
  @IsOptional() @IsString() memo?: string; // 배송메모
  @IsString() phone: string; // 수령인 연락처
}

export class CustomerAddressUpdateDto {
  @IsOptional() @IsString() title?: string; // 주소록 별칭
  @IsOptional() @IsString() recipient?: string; // 수령인
  @IsOptional() @IsString() address?: string; // 주소 (도로명)
  @IsOptional() @IsString() detailAddress?: string; // 주소 상세
  @IsOptional() @IsString() postalCode?: string; // 우편 번호
  @IsOptional() @IsBoolean() isDefault?: boolean; // 기본주소지 여부
  @IsOptional() @IsString() memo?: string; // 배송메모
  @IsOptional() @IsString() phone?: string; // 수령인 연락처
}
