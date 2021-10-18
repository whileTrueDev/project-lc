import { Box, Link, Table, Thead, Tbody, Tr, Th, Td, Heading } from '@chakra-ui/react';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import { LiveShoppingProgressConverter } from '../LiveShoppingProgressConverter';
import { BroadcasterName } from '../BroadcasterName';

export function AdminLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });
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
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            !isLoading &&
            data.map((row) => (
              <NextLink key={row.id} href={`/live-shopping/${row.id}`}>
                <Link as="tr">
                  <Td>{row.id}</Td>

                  <Td>{dayjs(row.createDate).format('YYYY/MM/DD HH:mm')}</Td>
                  <Td>{row.goods.goods_name}</Td>
                  <Td>{row.seller.sellerShop.shopName}</Td>
                  <Td>
                    <LiveShoppingProgressConverter progress={row.progress} />
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
                </Link>
              </NextLink>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default AdminLiveShoppingList;
