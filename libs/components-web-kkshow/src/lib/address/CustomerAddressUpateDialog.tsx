import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react';
import { CustomerAddress } from '@prisma/client';
import { useCustomerAddressUpdateMutation, useProfile } from '@project-lc/hooks';
import { CustomerAddressDto } from '@project-lc/shared-types';
import CustomerAddressForm from './CustomerAddressForm';

interface CustomerAddressUpateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  address: CustomerAddress;
}
export function CustomerAddressUpateDialog({
  isOpen,
  onClose,
  address,
}: CustomerAddressUpateDialogProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();
  const mutation = useCustomerAddressUpdateMutation();

  const handleCustomerAddressSubmit = (formData: CustomerAddressDto): void => {
    if (!profile?.id) return;
    mutation
      .mutateAsync({ customerId: profile?.id, addressId: address.id, ...formData })
      .then(() => {
        toast({
          status: 'success',
          description: '배송지가 수정되었습니다.',
        });
        onClose();
      })
      .catch(() => {
        toast({
          status: 'error',
          description: '배송지 수정중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
      });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>배송지 수정</ModalHeader>
        <ModalBody>
          <CustomerAddressForm
            onSubmit={handleCustomerAddressSubmit}
            defaultValues={{
              address: address.address || undefined,
              detailAddress: address.detailAddress || undefined,
              isDefault: address.isDefault || undefined,
              memo: address.memo || undefined,
              phone: address.phone || undefined,
              postalCode: address.postalCode || undefined,
              recipient: address.recipient || undefined,
              title: address.title || undefined,
            }}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isLoading={mutation.isLoading}
              form="customer-contacts-form"
              type="submit"
              colorScheme="blue"
            >
              수정
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CustomerAddressUpateDialog;
