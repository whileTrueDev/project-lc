import { TaxationType } from '@prisma/client';
import { IsString, IsBoolean, IsNumber, IsIn, IsOptional } from 'class-validator';

export class BroadcasterSettlementInfoDto {
  @IsIn(['naturalPerson', 'selfEmployedBusiness'])
  @IsOptional()
  type: TaxationType;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  idCardNumber: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  bank: string;

  @IsString()
  @IsOptional()
  accountNumber: string;

  @IsString()
  @IsOptional()
  accountHolder: string;

  @IsString()
  @IsOptional()
  idCardImageName: string;

  @IsString()
  @IsOptional()
  accountImageName: string;

  @IsBoolean()
  @IsOptional()
  taxManageAgreement: boolean;

  @IsBoolean()
  @IsOptional()
  personalInfoAgreement: boolean;

  @IsBoolean()
  @IsOptional()
  settlementAgreement: boolean;

  @IsNumber()
  broadcasterId: number;
}
