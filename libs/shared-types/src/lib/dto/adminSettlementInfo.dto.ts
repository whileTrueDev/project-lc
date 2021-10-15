import { SellerSettlementAccount } from '@prisma/client';
import { SellerBusinessRegistrationType } from './businessRegistrationConfirmation.dto';

export type AdminSettlementInfoType = {
  sellerSettlementAccount: SellerSettlementAccount[];
  sellerBusinessRegistration: SellerBusinessRegistrationType[];
};
