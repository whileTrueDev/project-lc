import { useAdminGoodsById } from '@project-lc/hooks';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { GoodsDetailCommonInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailCommonInfo';
import { GoodsDetailImagesInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailImagesInfo';
import { GoodsDetailInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailInfo';
import { GoodsDetailOptionsInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailOptionsInfo';
import { GoodsDetailPurchaseLimitInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailPurchaseLimitInfo';
import { GoodsDetailShippingInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailShippingInfo';
import { GoodsDetailSummary } from '@project-lc/components-seller/goods-detail/GoodsDetailSummary';

export interface LiveShoppingKkshowGoodsDetailDisplayProps {
  goodsId: number;
}
export function LiveShoppingKkshowGoodsDetailDisplay({
  goodsId,
}: LiveShoppingKkshowGoodsDetailDisplayProps): JSX.Element {
  const goods = useAdminGoodsById(goodsId);

  if (goods.isLoading) return <Text>...goods data loading</Text>;
  if (!goods.data) {
    return <Text>...no goods data</Text>;
  }

  return (
    <Accordion allowMultiple>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            상품 정보 보기
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          {/* 상품 요약 */}
          <Box as="section">
            <GoodsDetailSummary goods={goods.data} />
          </Box>

          {/* 상품 정보 */}

          <SectionWithTitle title="기본 정보">
            <GoodsDetailInfo goods={goods.data} />
          </SectionWithTitle>

          <SectionWithTitle title="상품사진 및 설명">
            <GoodsDetailImagesInfo goods={goods.data} />
          </SectionWithTitle>

          <SectionWithTitle title="옵션">
            <GoodsDetailOptionsInfo goods={goods.data} />
          </SectionWithTitle>

          <SectionWithTitle title="상품 공통 정보">
            <GoodsDetailCommonInfo goods={goods.data} />
          </SectionWithTitle>

          <SectionWithTitle title="구매 제한">
            <GoodsDetailPurchaseLimitInfo goods={goods.data} />
          </SectionWithTitle>

          {goods.data.ShippingGroup && (
            <SectionWithTitle title="배송정책">
              <GoodsDetailShippingInfo goods={goods.data} />
            </SectionWithTitle>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}

export default LiveShoppingKkshowGoodsDetailDisplay;
