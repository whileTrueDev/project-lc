import { LiveShoppingVideo } from '@prisma/client';
import { PaginationResult } from '../core/paginationResult';

export type LiveShoppingVideoRes = LiveShoppingVideo & {
  LiveShopping: {
    liveShoppingName: string;
    broadcaster: {
      userNickname: string;
    };
    broadcastStartDate: Date;
    broadcastEndDate: Date;
    sellStartDate: Date;
    sellEndDate: Date;
    seller: {
      sellerShop: {
        shopName: string;
      };
    };
  }[];
};

export type PaginatedLiveShoppingVideoRes = PaginationResult<LiveShoppingVideoRes>;
