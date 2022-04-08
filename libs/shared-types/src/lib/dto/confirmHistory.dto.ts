import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  PaperType,
  BusinessRegistrationStatus,
  SellerBusinessRegistration,
  BroadcasterSettlementInfo,
  SellerSettlementAccount,
} from '@prisma/client';

export class ConfirmHistoryDto {
  @IsEnum(PaperType) type: PaperType;
  @IsEnum(BusinessRegistrationStatus) status: BusinessRegistrationStatus;
  @IsOptional()
  @IsNumber()
  sellerBusinessRegistrationId: SellerBusinessRegistration['id'];

  @IsOptional()
  @IsNumber()
  sellerSettlementAccountId: SellerSettlementAccount['id'];

  @IsOptional()
  @IsNumber()
  broadcasterSettlementInfoId: BroadcasterSettlementInfo['id'];
}
