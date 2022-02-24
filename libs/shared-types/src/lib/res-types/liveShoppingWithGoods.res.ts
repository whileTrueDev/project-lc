import { LiveShopping } from '@prisma/client';
import { BroadcasterDTO } from '../dto/broadcaster.dto';

export interface LiveShoppingWithGoods extends LiveShopping {
  goods: {
    goods_name: string;
    summary: string;
  };
  seller: {
    sellerShop: {
      sellerId: number;
      shopName: string;
    };
  };
  broadcaster: BroadcasterDTO;
  liveShoppingVideo: { youtubeUrl: string };
}
