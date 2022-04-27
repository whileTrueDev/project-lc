import { Box, Button, Divider, Icon, Text } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { MdLockOutline } from 'react-icons/md';

export function GoodsViewInquiries(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (!goods.data) return null;
  return (
    <Box maxW="5xl" m="auto" id="goods-inquiries" minH="50vh" p={2} pt={20}>
      <Text fontSize="2xl">상품 문의 목록</Text>
      <Box>
        {[0, 1, 2, 3, 4].map((inq) => (
          <Fragment key={inq}>
            <Box my={2}>
              {inq !== 2 ? (
                <Text>양념이 다 샜어요ㅠ</Text>
              ) : (
                <Text color="GrayText">
                  비밀글입니다.
                  <Icon as={MdLockOutline} />
                </Text>
              )}
              <Text noOfLines={1}>
                <Text as="span" color={inq !== 0 ? 'blue.500' : 'GrayText'}>
                  {inq !== 0 ? '답변완료' : '답변대기'}
                </Text>
                <Text color="GrayText" as="span">
                  {' | '}
                </Text>
                <Text color="GrayText" as="span">
                  윤*영
                </Text>
                <Text color="GrayText" as="span">
                  {' | '}
                </Text>
                <Text color="GrayText" as="span">
                  2022.04.21
                </Text>
              </Text>
            </Box>
            <Divider />
          </Fragment>
        ))}

        <Box mt={4} textAlign="center">
          <Button>더보기</Button>
        </Box>
      </Box>
    </Box>
  );
}
