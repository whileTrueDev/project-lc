import React from 'react';
import { useTable, usePagination } from 'react-table';
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
} from '@chakra-ui/react';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
} from '@chakra-ui/icons';
import {
  useDeleteLiveShopping,
  useFmOrdersDuringLiveShoppingSales,
  useLiveShoppingList,
  useProfile,
} from '@project-lc/hooks';

export function BroadcasterLiveShoppingList(): JSX.Element {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    [],
  );
  // const { getTableProps, getTableBodyProps, headerGroups, prepareRow } = useTable(
  //   {
  //     columns,
  //   },
  //   usePagination,
  // );
  const { data: profileData } = useProfile();
  const { data, isLoading } = useLiveShoppingList({});
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Hello</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Wordl</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}
export default BroadcasterLiveShoppingList;
