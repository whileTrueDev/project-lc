import React, { useMemo } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  IconButton,
  Text,
  Tooltip,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  chakra,
  Box,
} from '@chakra-ui/react';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from '@chakra-ui/icons';
import {
  useDeleteLiveShopping,
  useBroadcasterFmOrdersDuringLiveShoppingSales,
  useBroadcasterLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';

// export interface LiveShoppingWithSalesFrontType extends LiveShoppingWithoutDate {
//   sellStartDate: string | Date | undefined | null;
//   sellEndDate: string | Date | undefined | null;
//   sales?: string | null;
//   broadcaster: BroadcasterDTOWithoutUserId;
//   goods: Pick<GoodsWithConfirmation, 'goods_name' | 'summary'>;
//   seller: { sellerShop: SellerShop };
//   liveShoppingVideo: { youtubeUrl: string } | null;
// }

export function BroadcasterLiveShoppingList(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data: tableData, isLoading } = useBroadcasterLiveShoppingList({
    broadcasterId: profileData?.id || 0,
    enabled: !!profileData?.id,
  });

  const { data: salesData } = useBroadcasterFmOrdersDuringLiveShoppingSales({
    broadcasterId: profileData?.id || 0,
    enabled: !!profileData?.id,
  });

  const liveShoppingWithSales: any[] = [];

  if (tableData && salesData) {
    for (let i = 0; i < tableData.length; i++) {
      liveShoppingWithSales.push({
        ...tableData[i],
        ...salesData.find((itmInner) => itmInner.id === tableData[i].id),
      });
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: '상품명',
        accessor: 'goods.goods_name',
      },
      {
        Header: '상태',
        accessor: 'progress',
      },
      {
        Header: '판매자',
        accessor: 'seller.sellerShop.shopName',
      },
      {
        Header: '방송시간',
        accessor: 'broadcastStartDate',
      },
      {
        Header: '판매시간',
        accessor: 'sellStartDate',
      },
      {
        Header: '매출',
        accessor: 'sales',
      },
      {
        Header: '유튜브영상',
        accessor: 'liveShoppingVideo.youtubeUrl',
      },
    ],
    [],
  );

  // const defaultData = useMemo(
  //   () => [
  //     {
  //       goods: {
  //         goods_name: '',
  //       },
  //       progress: '',
  //       seller: {
  //         sellerShop: {
  //           shopName: '',
  //         },
  //       },
  //       broadcastStartDate: '',
  //       sellStartDate: '',
  //       sale: '',
  //       liveShoppingVideo: {
  //         youtubeUrl: '',
  //       },
  //     },
  //   ],
  //   [],
  // );
  console.log(tableData);
  // console.log(liveShoppingWithSales);

  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } = useTable(
    {
      columns,
      data: liveShoppingWithSales,
    },
    usePagination,
  );

  return (
    <Box p={5}>
      {tableData && !isLoading && (
        <Table {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup}>
                {headerGroup.headers.map((column) => (
                  <Th key={column}>{column.render('Header')}</Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={i}>
                  {row.cells.map((cell) => {
                    return (
                      <Td key={cell} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
export default BroadcasterLiveShoppingList;
