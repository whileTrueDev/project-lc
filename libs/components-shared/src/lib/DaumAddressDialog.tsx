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
import { RefObject } from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';

export interface DaumAddressDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddressSelect: (data: AddressData) => void;
  finalFocusRef?: RefObject<HTMLElement>;
}
export function DaumAddressDialog({
  isOpen,
  onClose,
  onAddressSelect,
  finalFocusRef,
}: DaumAddressDialogProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} finalFocusRef={finalFocusRef}>
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
  finalFocusRef?: DaumAddressDialogProps['finalFocusRef'];
}
export function DaumAddressDialogButton({
  onAddressSelect,
  finalFocusRef,
}: DaumAddressDialogButtonProps): JSX.Element {
  const daumOpen = useDisclosure();

  const handleAddressSelect = (data: AddressData): void => {
    onAddressSelect(data);
    daumOpen.onClose();
  };
  return (
    <>
      <Button size="sm" onClick={daumOpen.onOpen}>
        주소찾기
      </Button>

      <DaumAddressDialog
        finalFocusRef={finalFocusRef}
        isOpen={daumOpen.isOpen}
        onClose={daumOpen.onClose}
        onAddressSelect={handleAddressSelect}
      />
    </>
  );
}
