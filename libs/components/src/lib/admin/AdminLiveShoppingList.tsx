import { Box, Text, Link, Flex } from '@chakra-ui/react';
import { useAdminLiveShoppingList, useProfile } from '@project-lc/hooks';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import NextLink from 'next/link';

export function AdminLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();

  const { data, isLoading, refetch } = useAdminLiveShoppingList({
    enabled: !!profileData?.email,
  });
  return (
    <Box>
      <Text>라이브 쇼핑 리스트</Text>
      {data &&
        !isLoading &&
        data.map((row) => (
          <NextLink key={row.id} href={`/live-shopping/${row.id}`}>
            <Link>
              <Flex>
                <Text as="span">{row.goods.goods_name}</Text>
                <Text as="span">{row.seller.sellerShop.shopName}</Text>
              </Flex>
            </Link>
          </NextLink>
        ))}
    </Box>
  );
}

export default AdminLiveShoppingList;
