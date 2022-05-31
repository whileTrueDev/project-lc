import { Box, Heading } from '@chakra-ui/react';
import AdminPageLayout from '@project-lc/components-admin/AdminPageLayout';
import { ReviewList } from '@project-lc/components-shared/goods-review/ReviewList';
import { ReviewPolicy } from '@project-lc/components-shared/goods-review/ReviewPolicy';

export function GoodsReviewIndex(): JSX.Element {
  return (
    <AdminPageLayout>
      <Heading>상품 리뷰 목록</Heading>

      <Box p={[2, 2, 4]}>
        <ReviewPolicy />

        <ReviewList
          dto={{ skip: 0, take: 5 }}
          // filterFn={(review) => review.goodsId === 1}
          enabled
          defaultFolded
          editable
          removable
          includeGoodsInfo
        />
      </Box>
    </AdminPageLayout>
  );
}

export default GoodsReviewIndex;
