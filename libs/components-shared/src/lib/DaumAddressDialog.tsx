import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';

export interface DaumAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (data: AddressData) => void;
}
export function DaumAddressDialog({
  isOpen,
  onClose,
  onAddressSelect,
}: DaumAddressDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>주소검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          <DaumPostcode focusContent focusInput onComplete={onAddressSelect} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default DaumAddressDialog;

interface DaumAddressDialogButtonProps {
  onAddressSelect: DaumAddressDialogProps['onAddressSelect'];
}
export function DaumAddressDialogButton({
  onAddressSelect,
}: DaumAddressDialogButtonProps): JSX.Element {
  const daumOpen = useDisclosure();
  return (
    <>
      <Button size="sm" onClick={daumOpen.onOpen}>
        주소찾기
      </Button>

      <DaumAddressDialog
        isOpen={daumOpen.isOpen}
        onClose={daumOpen.onClose}
        onAddressSelect={onAddressSelect}
      />
    </>
  );
}
