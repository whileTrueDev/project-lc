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
import { LiveShopingProgress } from '@project-lc/shared-types';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import { LiveShoppingProgressBadge } from '../LiveShoppingProgressBadge';
import { BroadcasterName } from '../BroadcasterName';

export function AdminLiveShoppingList({
  setGoodsId,
}: {
  setGoodsId: (goodsId: number) => void;
}): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });

  // TODO: 해당 라이브쇼핑 기간에 대한 조건 부여하기 -> useQuery도 변경 필요.
  function handleClick(row: LiveShoppingWithGoods): void {
    // 만약 해당 라이브커머스가 완료된 경우, 조회가 가능하다.
    // 시작 시간과 끝 시간을 넘겨준다.
    setGoodsId(row.goodsId);
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
                    // TODO : 추후에 라이브 쇼핑의 결과값에 따라 변경필요.
                    isDisabled={!(row.progress === LiveShopingProgress.확정됨)}
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
