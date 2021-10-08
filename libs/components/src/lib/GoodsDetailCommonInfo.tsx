import { Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { TextViewerWithDetailModal } from '..';

export interface GoodsDetailCommonInfoProps {
  goods: GoodsByIdRes;
}
/** 상품 공통 정보 컴포넌트 */
export function GoodsDetailCommonInfo({
  goods,
}: GoodsDetailCommonInfoProps): JSX.Element {
  return (
    <Stack>
      {goods.GoodsInfo ? (
        <TextViewerWithDetailModal
          title={`${goods.goods_name} 상품 공통 정보`}
          contents={goods.GoodsInfo.info_value}
        />
      ) : (
        <Text>상품 공통 정보가 입력되지 않은 상품입니다.</Text>
      )}
    </Stack>
  );
}
