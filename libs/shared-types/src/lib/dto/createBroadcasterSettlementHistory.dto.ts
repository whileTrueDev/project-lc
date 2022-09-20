import {
  Broadcaster,
  BroadcasterSettlementItems,
  BroadcasterSettlements,
  LiveShopping,
  ProductPromotion,
} from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateBroadcasterSettlementHistoryItem {
  @IsString() orderId: BroadcasterSettlementItems['orderId'];
  @IsString() exportCode: BroadcasterSettlementItems['exportCode'];
  @IsNumber() @IsOptional() liveShoppingId?: BroadcasterSettlementItems['liveShoppingId'];
  @IsNumber() @IsOptional() productPromotionId?: ProductPromotion['id'];
  @IsNumber() broadcasterId?: Broadcaster['id'];
  @IsNumber() amount: BroadcasterSettlementItems['amount'];
  @IsNotEmpty()
  broadcasterCommissionRate:
    | BroadcasterSettlementItems['broadcasterCommissionRate']
    | string;
}

export class CreateManyBroadcasterSettlementHistoryDto {
  @IsString() round: BroadcasterSettlements['round'];

  @IsArray()
  @ValidateNested()
  @Type(() => CreateBroadcasterSettlementHistoryItem)
  items: Array<CreateBroadcasterSettlementHistoryItem>;
}

export class CreateBcSettleHistoryWithExternalItemDto {
  @IsString() round: BroadcasterSettlements['round'];
  @IsNumber() broadcasterId: Broadcaster['id'];
  @IsNumber() amount: BroadcasterSettlementItems['amount'];
  @IsNumber() liveShoppingId: LiveShopping['id'];
}
