import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Heading,
  Text,
  Flex,
} from '@chakra-ui/react';
import { useCustomerAddress, useProfile } from '@project-lc/hooks';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridRowData } from '@material-ui/data-grid';
import { useFormContext } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';

type DeliveryListProps = {
  onClose: () => void;
  isOpen: boolean;
};

export function DeliveryAddressList({ onClose, isOpen }: DeliveryListProps): JSX.Element {
  const columns = [
    {
      field: '',
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="sm"
          onClick={() => {
            setValue('recipient', row.recipient);
            setValue('recipientPhone', row.phone);
            setValue('postalCode', row.postalCode);
            setValue('address', row.address);
            setValue('detailAddress', row.detailAddress);
            onClose();
          }}
        >
          선택
        </Button>
      ),
    },
    { field: 'title', headerName: '배송지이름' },
    { field: 'recipient', headerName: '수령인' },
    { field: 'phone', headerName: '연락처' },
    {
      field: 'postalCode',
      headerName: '주소',
      flex: 1,
      renderCell: ({ row }: GridRowData) => (
        <Flex direction="column">
          <Text as="span">{row.postalCode}</Text>
          <Text as="span">{row.address}</Text>
          <Text as="span">{row.detailAddress}</Text>
        </Flex>
      ),
    },
  ];
  const { data: profile } = useProfile();
  const { data, isLoading } = useCustomerAddress(profile?.id);

  const { setValue } = useFormContext<PaymentPageDto>();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Box>
            <Heading>배송지목록</Heading>
            {data && (
              <>
                <ChakraDataGrid
                  disableExtendRowFullWidth
                  autoHeight
                  pagination
                  autoPageSize
                  disableSelectionOnClick
                  disableColumnMenu
                  disableColumnSelector
                  loading={isLoading}
                  columns={columns}
                  rows={data}
                  rowHeight={100}
                />
              </>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
