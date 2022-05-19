import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { CustomerAddress } from '@prisma/client';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useCustomerAddress,
  useCustomerAddressDeleteMutation,
  useProfile,
} from '@project-lc/hooks';
import CustomerAddressUpateDialog from './CustomerAddressUpateDialog';

interface CustomerAddressListProps {
  selectable?: boolean;
  editable?: boolean;
  onItemSelect?: CustomerAddressListItemProps['onSelect'];
}
export function CustomerAddressList({
  onItemSelect,
  selectable = false,
  editable = true,
}: CustomerAddressListProps): JSX.Element {
  const { data: profile } = useProfile();
  const { isLoading, data: addresses } = useCustomerAddress(profile?.id);

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (!addresses || addresses.length === 0) {
    return <Box>아직 생성한 배송지가 없습니다.</Box>;
  }
  return (
    <Stack alignItems="flex-start">
      <Stack>
        {addresses?.map((address) => (
          <CustomerAddressListItem
            key={address.id}
            address={address}
            editable={editable}
            onSelect={selectable ? onItemSelect : undefined}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default CustomerAddressList;

interface CustomerAddressListItemProps {
  address: CustomerAddress;
  editable?: boolean;
  onSelect?: (data: CustomerAddress) => void;
}
export function CustomerAddressListItem({
  address,
  editable = true,
  onSelect,
}: CustomerAddressListItemProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();
  const updateDialog = useDisclosure(); // 수정 다이얼로그
  const deleteDialog = useDisclosure(); // 삭제 다이얼로그

  const addressDelete = useCustomerAddressDeleteMutation();
  /** 소비자 주소록 삭제 핸들러 */
  const handleDelete = async (): Promise<void> => {
    if (!profile?.id) return;
    addressDelete
      .mutateAsync({ addressId: address.id, customerId: profile?.id })
      .then(() => {
        toast({ description: '주소록이 삭제되었습니다.', status: 'success' });
      })
      .catch(() => {
        toast({
          description: '주소록 삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          status: 'error',
        });
      });
  };

  return (
    <Box p={2} rounded="md" borderWidth="thin" maxW={450} w="100%">
      <Flex
        flexDir={address.isDefault ? 'row' : 'row-reverse'}
        alignItems="center"
        justify="space-between"
      >
        {address.isDefault && <Badge variant="outline">기본 배송지</Badge>}

        <Flex gap={1}>
          {onSelect ? (
            <Button leftIcon={<CheckIcon />} size="xs" onClick={() => onSelect(address)}>
              선택
            </Button>
          ) : null}

          {editable ? (
            <>
              <Button leftIcon={<EditIcon />} size="xs" onClick={updateDialog.onOpen}>
                수정
              </Button>
              <Button leftIcon={<DeleteIcon />} size="xs" onClick={deleteDialog.onOpen}>
                삭제
              </Button>
            </>
          ) : null}
        </Flex>
      </Flex>

      <Text fontWeight="bold">{address.title}</Text>
      <Text fontSize="sm">{address.recipient}</Text>
      <Text fontSize="sm">
        ({address.postalCode}) {address.address} {address.detailAddress}
      </Text>
      <Text fontSize="sm">{address.phone}</Text>
      <Text fontSize="sm">{address.memo}</Text>

      {/* 배송지 수정 다이얼로그 */}
      <CustomerAddressUpateDialog
        isOpen={!!(updateDialog.isOpen && address)}
        onClose={updateDialog.onClose}
        address={address}
      />

      {/* 배송지 삭제 다이얼로그  */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={deleteDialog.onClose}
        title={`배송지 ${address.title} 삭제`}
        onConfirm={handleDelete}
      >
        <Text fontWeight="bold">{address.title}</Text>
        <Text>배송지 삭제하시겠습니까?</Text>
      </ConfirmDialog>
    </Box>
  );
}
