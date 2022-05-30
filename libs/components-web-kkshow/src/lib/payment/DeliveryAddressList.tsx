import {
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { CustomerAddress } from '@prisma/client';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { useFormContext } from 'react-hook-form';
import CustomerAddressList from '../address/CustomerAddressList';

type DeliveryListProps = {
  onClose: () => void;
  isOpen: boolean;
};

export function DeliveryAddressList({ onClose, isOpen }: DeliveryListProps): JSX.Element {
  const { handleAddressType } = useKkshowOrderStore();
  const handleAddressSelect = (data: CustomerAddress): void => {
    setValue('recipient', data.recipient || '');
    setValue('recipientPhone', data.phone || '');
    setValue('postalCode', data.postalCode || '');
    setValue('address', data.address || '');
    setValue('detailAddress', data.detailAddress || '');
    setValue('deliveryMemo', data.memo || '');
    if (data.isDefault) {
      handleAddressType('default');
    } else {
      handleAddressType('list');
    }
    onClose();
  };

  const { setValue } = useFormContext<PaymentPageDto>();

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered size="sm">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>배송지목록</ModalHeader>
        <ModalBody>
          <Center>
            <CustomerAddressList
              editable={false}
              selectable
              onItemSelect={handleAddressSelect}
            />
          </Center>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
