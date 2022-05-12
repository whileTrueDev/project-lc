import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useCustomerAddress, useProfile, useDisplaySize } from '@project-lc/hooks';
import { ChakraDataGrid } from '@project-lc/components-core/ChakraDataGrid';
import { GridRowData } from '@material-ui/data-grid';
import { useFormContext } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';

type DeliveryListProps = {
  onClose: () => void;
  isOpen: boolean;
};

export function DeliveryAddressList({ onClose, isOpen }: DeliveryListProps): JSX.Element {
  const { isDesktopSize } = useDisplaySize();
  const { handleAddressType } = useKkshowOrderStore();
  const columns = [
    {
      field: '',
      width: 40,
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            setValue('recipient', row.recipient);
            setValue('recipientPhone', row.phone);
            setValue('postalCode', row.postalCode);
            setValue('address', row.address);
            setValue('detailAddress', row.detailAddress);
            handleAddressType('list');
            onClose();
          }}
          colorScheme="blue"
        >
          선택
        </Button>
      ),
    },
    { field: 'title', headerName: '배송지명' },
    { field: 'recipient', headerName: '수령인' },
    { field: 'phone', headerName: '연락처', width: 130 },
    {
      field: 'postalCode',
      headerName: '주소',
      minWidth: 230,
      flex: 1,
      renderCell: ({ row }: GridRowData) => (
        <div style={{ lineHeight: 'normal' }}>
          <Text>{row.postalCode}</Text>
          <Text>{row.address}</Text>
          <Text>{row.detailAddress}</Text>
        </div>
      ),
    },
  ];

  const mobileColumns = [
    {
      field: '',
      width: 40,
      renderCell: ({ row }: GridRowData) => (
        <Button
          size="xs"
          onClick={() => {
            setValue('recipient', row.recipient);
            setValue('recipientPhone', row.phone);
            setValue('postalCode', row.postalCode);
            setValue('address', row.address);
            setValue('detailAddress', row.detailAddress);
            handleAddressType('list');
            onClose();
          }}
          colorScheme="blue"
        >
          선택
        </Button>
      ),
    },
    {
      field: 'postalCode',
      headerName: '주소',
      minWidth: 230,
      flex: 1,
      renderCell: ({ row }: GridRowData) => (
        <div style={{ lineHeight: 'normal' }}>
          <Text>{row.postalCode}</Text>
          <Text>{row.address}</Text>
          <Text>{row.detailAddress}</Text>
        </div>
      ),
    },
  ];
  const { data: profile } = useProfile();
  const { data, isLoading } = useCustomerAddress(profile?.id);

  const { setValue } = useFormContext<PaymentPageDto>();

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="3xl">
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
                  columns={isDesktopSize ? columns : mobileColumns}
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
