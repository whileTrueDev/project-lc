import {
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { CustomerAddress } from '@prisma/client';
import { CreateOrderForm } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { useFormContext } from 'react-hook-form';
import { CustomerAddressCreateButton } from '../address/CustomerAddressCreateDialog';
import CustomerAddressList from '../address/CustomerAddressList';

type DeliveryListProps = {
  onClose: () => void;
  isOpen: boolean;
};

export function DeliveryAddressList({ onClose, isOpen }: DeliveryListProps): JSX.Element {
  const { handleAddressType } = useKkshowOrderStore();
  const handleAddressSelect = (data: CustomerAddress): void => {
    const phoneData = (data.phone || '').match(/(\d+)/g);
    if (phoneData && phoneData.length === 3) {
      const [phone1, phone2, phone3] = phoneData;
      setValue('recipientPhone1', phone1 || '');
      setValue('recipientPhone2', phone2 || '');
      setValue('recipientPhone3', phone3 || '');
    }
    setValue('recipientName', data.recipient || '');
    setValue('recipientPostalCode', data.postalCode || '');
    setValue('recipientAddress', data.address || '');
    setValue('recipientDetailAddress', data.detailAddress || '');
    setValue('memo', data.memo || '');
    if (data.isDefault) {
      handleAddressType('default');
    } else {
      handleAddressType('list');
    }
    onClose();
  };

  const { setValue } = useFormContext<CreateOrderForm>();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>배송지목록</ModalHeader>
        <ModalBody>
          <CustomerAddressCreateButton />
          <Center>
            <CustomerAddressList
              editable={false}
              selectable
              onItemSelect={handleAddressSelect}
            />
          </Center>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>닫기</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
