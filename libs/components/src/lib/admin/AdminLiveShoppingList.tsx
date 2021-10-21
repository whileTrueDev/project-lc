import {
  Box,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
} from '@chakra-ui/react';
import {
  useAdminLiveShoppingList,
  LiveShoppingWithGoods,
  useProfile,
} from '@project-lc/hooks';
import {
  LiveShoppingProgressParams,
  getLiveShoppingProgress,
} from '@project-lc/shared-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import { LiveShoppingProgressBadge } from '../LiveShoppingProgressBadge';
import { BroadcasterName } from '../BroadcasterName';

export type SeletctedLiveShoppingType = Partial<LiveShoppingProgressParams> & {
  goodsId: number;
};

export function AdminLiveShoppingList({
  setSelectedGoods,
}: {
  setSelectedGoods: (selectedGoods: SeletctedLiveShoppingType) => void;
}): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });

  function handleClick(row: LiveShoppingWithGoods): void {
    setSelectedGoods({
      goodsId: row.goodsId,
      broadcastStartDate: row.broadcastStartDate,
      broadcastEndDate: row.broadcastEndDate,
      sellEndDate: row.sellEndDate,
    });
  }

  // 선물 목록을 조회할 수 있는 라이브커머스의 조건
  function checkGiftList(row: LiveShoppingWithGoods): boolean {
    const progress = getLiveShoppingProgress({
      progress: row.progress,
      broadcastStartDate: row.broadcastStartDate,
      broadcastEndDate: row.broadcastEndDate,
      sellEndDate: row.sellEndDate,
    });
    return ['판매종료', '방송진행중', '방송종료'].includes(progress);
  }

  return (
    <Box p={5}>
      <Heading size="md">라이브 쇼핑 리스트</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>등록일자</Th>
            <Th>상품명</Th>
            <Th>상점명</Th>
            <Th>상태</Th>
            <Th>방송인</Th>
            <Th>방송시작</Th>
            <Th>방송종료</Th>
            <Th>판매시작</Th>
            <Th>판매종료</Th>
            <Th>선물 목록 조회</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            !isLoading &&
            data.map((row) => (
              <Tr key={row.id}>
                <Td>{row.id}</Td>
                <Td>{dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}</Td>
                <Td>
                  <NextLink href={`/live-shopping/${row.id}`}>
                    <Link>{row.goods.goods_name}</Link>
                  </NextLink>
                </Td>
                <Td>{row.seller.sellerShop.shopName}</Td>
                <Td>
                  <LiveShoppingProgressBadge
                    progress={row.progress}
                    broadcastStartDate={row.broadcastStartDate}
                    broadcastEndDate={row.broadcastEndDate}
                    sellEndDate={row.sellEndDate}
                  />
                </Td>
                <Td>
                  <BroadcasterName data={row.broadcaster} />
                </Td>
                <Td>
                  {row.broadcastStartDate
                    ? dayjs(row.broadcastStartDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.broadcastEndDate
                    ? dayjs(row.broadcastEndDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.sellStartDate
                    ? dayjs(row.sellStartDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  {row.sellEndDate
                    ? dayjs(row.sellEndDate).format('YYYY/MM/DD HH:mm')
                    : '미정'}
                </Td>
                <Td>
                  <Button
                    size="xs"
                    onClick={() => {
                      handleClick(row);
                    }}
                    isDisabled={!checkGiftList(row)}
                  >
                    선물 목록 조회
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminLiveShoppingList;
