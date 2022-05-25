import { ListItem, OrderedList } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailKeywordsProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailKeywords({
  goods,
}: GoodsDetailKeywordsProps): JSX.Element | null {
  if (!goods.searchKeyword) return null;
  return (
    <OrderedList>
      {goods.searchKeyword.split(',').map((keyword) => (
        <ListItem key={keyword}>{keyword}</ListItem>
      ))}
    </OrderedList>
  );
}
