import { Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { TextDotConnector } from '..';

// export interface GoodsDetailTitleProps {
//   goods: GoodsByIdRes;
// }
export function LiveShoppingDetailTitle({ liveShopping }: any): JSX.Element {
  return (
    <>
      <Heading>{liveShopping.goods.goods_name}</Heading>
      <Stack direction="row" alignItems="center">
        <Text size="md">판매자명 : </Text>
        <Text size="md">{liveShopping.seller?.sellerShop.shopName}</Text>
        <TextDotConnector />
        <Text>{liveShopping.progress}</Text>
        <TextDotConnector />
        <Text>{dayjs(liveShopping.createDate).fromNow()}</Text>
      </Stack>
    </>
  );
}
