import { Stack, Text } from '@chakra-ui/react';
import GoodsDefaultCommonInfoText from '@project-lc/components-shared/goods/GoodsDefaultCommonInfoText';
import { TextViewerWithDetailModal } from '@project-lc/components-shared/TextViewerWithDetailModal';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailCommonInfoProps {
  goods: GoodsByIdRes;
}
/** 상품 공통 정보 컴포넌트 */
export function GoodsDetailCommonInfo({
  goods,
}: GoodsDetailCommonInfoProps): JSX.Element {
  return (
    <Stack>
      {goods.goodsInfoId && goods.GoodsInfo ? (
        <TextViewerWithDetailModal
          title={`${goods.goods_name} 상품 공통 정보`}
          contents={goods.GoodsInfo?.info_value}
        />
      ) : (
        // 상품공통정보를 입력하지 않거나 연결된 상품공통정보가 없는경우 기본공통정보 표시
        <Stack>
          <Text color="GrayText">
            연결된 상품 공통 정보가 없어 아래 기본 문구가 표시됩니다
          </Text>
          <GoodsDefaultCommonInfoText />
        </Stack>
      )}
    </Stack>
  );
}
