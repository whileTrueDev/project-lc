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
  const { setValue } = useFormContext<CreateOrderForm>();
  const handleAddressSelect = (data: CustomerAddress): void => {
    const phoneData = data.phone || '';
    if (/(\d+)-(\d+)-(\d+)/g.test(phoneData)) {
      const _phoneData = (data.phone || '').match(/(\d+)/g);
      if (_phoneData && _phoneData.length === 3) {
        const [phone1, phone2, phone3] = _phoneData;
        setValue('recipientPhone1', phone1 || '', { shouldValidate: true });
        setValue('recipientPhone2', phone2 || '', { shouldValidate: true });
        setValue('recipientPhone3', phone3 || '', { shouldValidate: true });
      }
    }
    if (/\d+$/g.test(phoneData)) {
      const phone1 = phoneData.slice(0, 3);
      const phone2 = phoneData.slice(3, 7);
      const phone3 = phoneData.slice(7, 11);
      setValue('recipientPhone1', phone1 || '', { shouldValidate: true });
      setValue('recipientPhone2', phone2 || '', { shouldValidate: true });
      setValue('recipientPhone3', phone3 || '', { shouldValidate: true });
    }
    setValue('recipientName', data.recipient || '', { shouldValidate: true });
    setValue('recipientPostalCode', data.postalCode || '', { shouldValidate: true });
    setValue('recipientAddress', data.address || '', { shouldValidate: true });
    setValue('recipientDetailAddress', data.detailAddress || '', {
      shouldValidate: true,
    });
    setValue('memo', data.memo || '', { shouldValidate: true });
    if (data.isDefault) {
      handleAddressType('default');
    } else {
      handleAddressType('list');
    }
    onClose();
  };

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
