import { TaxationType } from '@prisma/client';
import { IsString, IsBoolean, IsNumber, IsIn, IsOptional } from 'class-validator';

export class BroadcasterSettlementInfoDto {
  @IsIn(['naturalPerson', 'selfEmployedBusiness'])
  type: TaxationType;

  @IsString()
  name: string;

  @IsString()
  idCardNumber: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  bank: string;

  @IsString()
  accountNumber: string;

  @IsString()
  accountHolder: string;

  @IsString()
  idCardImageName: string;

  @IsString()
  accountImageName: string;

  @IsBoolean()
  @IsOptional()
  taxManageAgreement: boolean;

  @IsBoolean()
  personalInfoAgreement: boolean;

  @IsBoolean()
  settlementAgreement: boolean;

  @IsNumber()
  broadcasterId: number;
}
