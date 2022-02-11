import { Stack, Button, Box, Link, Text } from '@chakra-ui/react';
import { boxStyle } from '@project-lc/components-constants/commonStyleProps';
import { useAdminProductPromotion } from '@project-lc/hooks';
import { ProductPromotionListItemData } from '@project-lc/shared-types';

export interface AdminBroadcasterProductPromotionSectionProps {
  promotionPageId: number;
}
export function AdminBroadcasterProductPromotionSection({
  promotionPageId,
}: AdminBroadcasterProductPromotionSectionProps): JSX.Element {
  const { data: productPromotionList } = useAdminProductPromotion(promotionPageId);
  return (
    <Stack>
      <Stack direction="row" alignItems="center">
        <Text>홍보중인 상품 </Text>
        <Button>상품 추가하기</Button>
      </Stack>

      {productPromotionList && productPromotionList.length > 0 ? (
        <Stack direction="row">
          {productPromotionList.map((item) => (
            <ProductPromotionItemBox item={item} key={item.id} />
          ))}
        </Stack>
      ) : (
        <Text>홍보중인 상품이 없습니다 </Text>
      )}
    </Stack>
  );
}

export function ProductPromotionItemBox({
  item,
}: {
  item: ProductPromotionListItemData;
}): JSX.Element {
  return (
    <Box key={item.id} {...boxStyle}>
      <Link href={`/goods/${item.goodsId}`} color="blue.500">
        상품명 : {item.goods.goods_name}
      </Link>

      <Stack>
        <Text>판매자 : {item.goods.seller.name}</Text>
        <Text>상점명 : {item.goods.seller?.sellerShop?.shopName}</Text>
        <Text>와일트루 수수료 : {item.whiletrueCommissionRate} %</Text>
        <Text>방송인 수수료 : {item.broadcasterCommissionRate} %</Text>
      </Stack>
    </Box>
  );
}

export default AdminBroadcasterProductPromotionSection;
