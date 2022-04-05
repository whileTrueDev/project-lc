import { IsEnum } from 'class-validator';
import { SellerPaperType, BusinessRegistrationStatus } from '@prisma/client';

export class SellerSettlementConfirmHistoryDto {
  @IsEnum(SellerPaperType) type: SellerPaperType;
  @IsEnum(BusinessRegistrationStatus) status: BusinessRegistrationStatus;
}
