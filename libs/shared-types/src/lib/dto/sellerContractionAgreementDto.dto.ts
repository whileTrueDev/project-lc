import { IsBoolean, IsString } from 'class-validator';

export class SellerContractionAgreementDto {
  @IsString() email: string;
  @IsBoolean() agreementFlag: boolean;
}
