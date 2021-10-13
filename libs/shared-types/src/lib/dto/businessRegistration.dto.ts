import { IsEmail, IsString } from 'class-validator';

export class BusinessRegistrationDto {
  // 회사명
  @IsString() companyName: string;
  // 사업자 등록 번호
  @IsString() businessRegistrationNumber: string;
  // 대표자명
  @IsString() representativeName: string;
  // 업태
  @IsString() businessType: string;
  // 종목
  @IsString() businessItem: string;
  // 사업장 주소
  @IsString() businessAddress: string;
  // 세금계산서 발행 이메일
  @IsEmail() taxInvoiceMail: string;
  // 이미지 파일명
  @IsString() businessRegistrationImageName: string;

  @IsString() mailOrderSalesNumber: string;

  @IsString() mailOrderSalesImageName: string;
}
