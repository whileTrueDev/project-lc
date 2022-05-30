/* eslint-disable react/no-array-index-key */
import { Box, Text } from '@chakra-ui/react';
import { SellerGoodsInquiryList } from '@project-lc/components-seller/goods-inquiry/SellerGoodsInquiryList';
import MypageLayout from '@project-lc/components-shared/MypageLayout';

export function GoodsInquiries(): JSX.Element {
  return (
    <MypageLayout>
      <Box maxW="4xl" m="auto">
        <Text fontWeight="bold" fontSize="xl">
          상품 문의 관리
        </Text>
        <SellerGoodsInquiryList />
      </Box>
    </MypageLayout>
  );
}

export default GoodsInquiries;
