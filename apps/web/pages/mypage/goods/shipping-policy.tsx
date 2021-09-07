import { MypageLayout, ShippingPolicyForm } from '@project-lc/components';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import React from 'react-transition-group/node_modules/@types/react';

export function TempShippingPolicy(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <MypageLayout>
      <Text>배송비정책 생성 모달창 작업을 위한 임시 페이지</Text>
      <Button onClick={onOpen}>배송비정책 생성</Button>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <ShippingPolicyForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </MypageLayout>
  );
}

export default TempShippingPolicy;
