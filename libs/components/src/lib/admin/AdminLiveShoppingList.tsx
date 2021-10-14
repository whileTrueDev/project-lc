import { Box, Text, Link, Table, Thead, Tbody, Tr, Th, Td, Tag } from '@chakra-ui/react';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import NextLink from 'next/link';

export function AdminLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });
  return (
    <Box>
      <Text>라이브 쇼핑 리스트</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>상품명</Th>
            <Th>상점명</Th>
            <Th>등록일자</Th>
            <Th>상태</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data &&
            !isLoading &&
            data.map((row) => (
              <NextLink key={row.id} href={`/live-shopping/${row.id}`}>
                <Link as="tr">
                  <Td>{row.id}</Td>
                  <Td>{row.goods.goods_name}</Td>
                  <Td>{row.seller.sellerShop.shopName}</Td>
                  <Td>{row.createDate}</Td>
                  <Td>
                    <Tag>{row.progress}</Tag>
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
