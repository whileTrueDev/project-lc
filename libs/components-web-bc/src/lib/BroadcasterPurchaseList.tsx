/* eslint-disable react/no-array-index-key */
import { RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useOrderByBroadcasterList, useProfile } from '@project-lc/hooks';
import dayjs from 'dayjs';

export function BroadcasterPurchaseList(): JSX.Element | null {
  const refetchBtnSize = useBreakpointValue({ base: 'sm', md: 'md' });
  const { data: profileData } = useProfile();
  const {
    data: purchaseData,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useOrderByBroadcasterList(profileData?.id, {
    take: 3,
  });

  if (!purchaseData) return null;

  return (
    <Box maxW="4xl" mx="auto">
      <Button
        isLoading={isLoading || isFetching}
        leftIcon={<RepeatIcon />}
        variant="outline"
        size={refetchBtnSize}
        onClick={() => refetch()}
      >
        새로고침
      </Button>

      {purchaseData.pages.every((x) => x.orders.length === 0) && (
        <Text my={10}>아직 데이터가 없습니다.</Text>
      )}

      {purchaseData.pages.map((page, pageIndex) => (
        <Box key={pageIndex}>
          {page.orders.map((purchase) => (
            <Box
              key={purchase.orderCode}
              mt={2}
              borderWidth="thin"
              p={[2, 4]}
              rounded="md"
            >
              <Box mb={2} fontSize="sm">
                <Text>주문 {purchase.orderCode}</Text>
                <Text>{dayjs(purchase.createDate).format('YYYY/MM/DD HH:mm:ss')}</Text>
              </Box>
              {purchase.orderItems.map((item) => (
                <Box key={item.id} my={2}>
                  <Flex gap={2} alignItems="center">
                    <Image
                      objectFit="cover"
                      w={35}
                      h={35}
                      src={item.goods.image[0].image}
                      rounded="md"
                    />
                    <Box>
                      <Text>{item.goods.goods_name}</Text>
                      <Text fontSize="xs">
                        {item.goods.seller.sellerShop.shopName || ''}
                      </Text>
                    </Box>
                  </Flex>

                  <Stack>
                    <Box>
                      <Text fontSize="sm" fontWeight="bold">
                        닉네임
                      </Text>
                      <Text>{item.support.nickname}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" fontWeight="bold">
                        응원메시지
                      </Text>
                      <Text>{item.support.message}</Text>
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ))}

      {hasNextPage && (
        <Center mt={4}>
          <Button
            type="button"
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            더보기
          </Button>
        </Center>
      )}
    </Box>
  );
}

export default BroadcasterPurchaseList;
