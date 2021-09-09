import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { ShippingSetFormData } from '@project-lc/shared-types';
import { useShippingGroupItemStore, useShippingSetItemStore } from '@project-lc/stores';
import { useCallback } from 'react';
import SectionWithTitle from './SectionWithTitle';
import ShippingPolicySetForm from './ShippingPolicySetForm';
import SetItem from './ShippingPolicySetListItem';

export function ShippingPolicySetList(): JSX.Element {
  const { shippingSets, removeShippingSet } = useShippingGroupItemStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { reset } = useShippingSetItemStore();
  const closeHandler = useCallback(() => {
    onClose();
    reset();
  }, [onClose, reset]);
  return (
    <SectionWithTitle title="배송 방법">
      {/* 배송 옵션 목록(임시) */}
      <Stack spacing={2} mb={2}>
        {shippingSets.map((set: ShippingSetFormData) => (
          <SetItem key={set.tempId} set={set} onDelete={removeShippingSet} />
        ))}
      </Stack>
      {/* 배송방법 추가 모달 버튼 */}
      <Button onClick={onOpen} w="150px">
        {isOpen ? '닫기' : '추가하기'}
      </Button>
      {/* 배송옵션 추가 모달 */}
      <Modal onClose={closeHandler} isOpen={isOpen} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>배송 옵션 추가하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShippingPolicySetForm onSubmit={closeHandler} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </SectionWithTitle>
  );
}

export default ShippingPolicySetList;
