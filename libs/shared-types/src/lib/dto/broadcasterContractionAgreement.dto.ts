import { IsBoolean, IsString } from 'class-validator';

export class BroadcasterContractionAgreementDto {
  @IsString() email: string;
  @IsBoolean() agreementFlag: boolean;
}
