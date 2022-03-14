import { IsBoolean, IsNumber } from 'class-validator';

export class SellerContractionAgreementDto {
  @IsNumber() id: number;
  @IsBoolean() agreementFlag: boolean;
}
