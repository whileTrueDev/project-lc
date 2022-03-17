import { IsBoolean, IsNumber } from 'class-validator';

export class BroadcasterContractionAgreementDto {
  @IsNumber() id: number;
  @IsBoolean() agreementFlag: boolean;
}
