import { Box, Button, Divider, Flex, Image, Text } from '@chakra-ui/react';
import StarRating from '@project-lc/components-core/StarRating';
import { useGoodsById } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import 'suneditor/dist/css/suneditor.min.css';

const dummyReviews = [
  {
    rating: 4.5,
    createDate: new Date(),
    content: `5살 첫째가 한글을 익히기 시작하면서 기존에 보던 핑크퐁 한글카드는
    아쉬움이 있어 구매했어요 4살이 되면서 부터는 한글을 조금씩 배우기
    시작했는데 핑크퐁카드에는 낱말옆에 그림이 있어 아이가 그 그림을 보고
    단어를 맞히는거에요 매번 손으로 가리다가 귀찮던 참에 골드박스에 엄마랑
    낱말카드 떠서 구매했는데 마감도 날카롭지않고 세이펜으로 소리도 들려줄수
    있고 가독성도 좋아 만족스럽네요`,
    goodsId: 1,
    id: 1,
    writer: '강호동',
  },
];

export function GoodsViewReviews(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);
  if (!goods.data) return null;
  return (
    <Box maxW="5xl" m="auto" id="goods-reviews" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">후기 목록</Text>
      <Box>
        {dummyReviews.length === 0 && (
          <Box my={10}>
            <Text>아직 이 상품에 대한 후기가 없습니다.</Text>
          </Box>
        )}
        {dummyReviews.map((review) => (
          <Fragment key={review.id}>
            <Box my={2}>
              <StarRating rating={review.rating} color="orange.300" />
              <Text color="GrayText" fontSize="sm">
                {review.writer} / {dayjs(review.createDate).format('YYYY-MM-DD')}
              </Text>
              <Image
                objectFit="cover"
                h="150px"
                w="150px"
                src="https://k-kmarket.com/data/board/goods_review/_thumb_873dfd04f466d76f27e88e482633934c1310364.jpg"
              />
              <Flex gap={2}>
                <Text noOfLines={3}>{review.content}</Text>
              </Flex>
            </Box>
            <Divider />
          </Fragment>
        ))}

        {dummyReviews.length > 0 && (
          <Box mt={4} textAlign="center">
            <Button>더보기</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
