import { Box, Text } from '@chakra-ui/react';
import { ReviewList } from '@project-lc/components-shared/goods-review/ReviewList';
import MypageLayout from '@project-lc/components-shared/MypageLayout';
import { useProfile } from '@project-lc/hooks';

export function GoodsReviewsIndex(): JSX.Element {
  return (
    <MypageLayout>
      <Box maxW="4xl" m="auto">
        <Text fontWeight="bold" fontSize="xl">
          상품 후기 관리
        </Text>

        <SellerGoodsReviewList />
      </Box>
    </MypageLayout>
  );
}

export default GoodsReviewsIndex;

function SellerGoodsReviewList(): JSX.Element | null {
  const { data: profile } = useProfile();
  if (!profile) return null;
  if (!(profile.type === 'seller')) return null;
  return (
    <ReviewList
      dto={{ sellerId: profile.id, skip: 0, take: 5 }}
      enabled={!!profile.id}
      defaultFolded
      includeGoodsInfo
      includeCommentStatus
    />
  );
}
