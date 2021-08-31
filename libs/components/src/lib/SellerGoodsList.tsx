import { Box } from '@chakra-ui/react';
import { useProfile, useSellerGoodsList } from '@project-lc/hooks';
import { SortColumn, SortDirection } from '@project-lc/shared-types';

export function SellerGoodsList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useSellerGoodsList(
    {
      page: 1,
      itemPerPage: 10,
      sort: SortColumn.REGIST_DATE,
      direction: SortDirection.DESC,
      email: profileData?.email || '',
    },
    {
      enabled: !!profileData?.email,
    },
  );
  return <Box>상품{JSON.stringify(data, null, 2)}</Box>;
}

export default SellerGoodsList;
