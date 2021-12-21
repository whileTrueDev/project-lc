import {
  Button,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { IAdminSettlementDoneList, useAdminSettlementDoneList } from '@project-lc/hooks';
import dayjs from 'dayjs';
import { useState } from 'react';
import { SettlementInfoDialog } from './SettlementInfoDialog';

/** 판매자 정산 완료 목록 */
export function AdminSettlementDoneList(): JSX.Element | null {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const { isLoading, data } = useAdminSettlementDoneList();

  const [selected, setSelected] = useState<IAdminSettlementDoneList[number]>();

  if (isLoading) return <Spinner />;
  if (!data) return null;

  return (
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>정산완료일</Th>
          <Th>정산번호</Th>
          <Th>출고번호</Th>
          <Th>출고코드</Th>
          <Th>총 정산상품 개수</Th>
          <Th>총 금액</Th>
          <Th>전자결제 수수료</Th>
          <Th>결제방법</Th>
          <Th>pg</Th>
          <Th>배송비</Th>
          <Th>총 수수료액</Th>
          <Th>총정산금액</Th>
          <Th>자세히보기</Th>
        </Tr>
      </Thead>

      <Tbody>
        {data.map((history) => (
          <Tr key={history.id}>
            <Td>{dayjs(history.date).format('YYYY/MM/DD HH:mm:ss')}</Td>
            <Td>{history.id}</Td>
            <Td>{history.exportId}</Td>
            <Td>{history.exportCode}</Td>
            <Td>{history.totalEa}</Td>
            <Td>{history.totalPrice.toLocaleString()}</Td>
            <Td>{history.pgCommission.toLocaleString()}</Td>
            <Td>{history.paymentMethod}</Td>
            <Td>{history.pg}</Td>
            <Td>{history.shippingCost}</Td>
            <Td>{history.totalCommission.toLocaleString()}</Td>
            <Td>{history.totalAmount.toLocaleString()}</Td>
            <Td>
              <Button
                size="xs"
                onClick={() => {
                  onOpen();
                  setSelected(history);
                }}
              >
                자세히보기
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>

      {selected && (
        <SettlementInfoDialog
          isOpen={isOpen}
          onClose={onClose}
          settlementInfo={selected}
        />
      )}
    </Table>
  );
}
