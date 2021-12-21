import {
  Broadcaster,
  BroadcasterSettlementItems,
  BroadcasterSettlements,
} from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateBroadcasterSettlementHistoryItem {
  @IsString() orderId: BroadcasterSettlementItems['orderId'];
  @IsString() exportCode: BroadcasterSettlementItems['exportCode'];
  @IsNumber() liveShoppingId: BroadcasterSettlementItems['liveShoppingId'];
  @IsNumber() broadcasterId: Broadcaster['id'];
  @IsNumber() amount: BroadcasterSettlementItems['amount'];
}

export class CreateManyBroadcasterSettlementHistoryDto {
  @IsString() round: BroadcasterSettlements['round'];

  @IsArray()
  @ValidateNested()
  @Type(() => CreateBroadcasterSettlementHistoryItem)
  items: Array<CreateBroadcasterSettlementHistoryItem>;
}
