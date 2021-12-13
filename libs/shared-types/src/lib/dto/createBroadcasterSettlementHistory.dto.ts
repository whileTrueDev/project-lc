import { BroadcasterSettlementOrders, BroadcasterSettlements } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

class CreateBroadcasterSettlementHistoryItem {
  orderId: BroadcasterSettlementOrders['orderId'];
  exportId: BroadcasterSettlementOrders['exportId'];
}

export class CreateBroadcasterSettlementHistoryDto {
  @IsString() round: BroadcasterSettlements['round'];
  @IsNumber() totalAmount: BroadcasterSettlements['totalAmount'];
  @IsNumber() totalCommission: BroadcasterSettlements['totalCommission'];

  @IsArray()
  @ValidateNested()
  @Type(() => CreateBroadcasterSettlementHistoryItem)
  items: Array<CreateBroadcasterSettlementHistoryItem>;
}
