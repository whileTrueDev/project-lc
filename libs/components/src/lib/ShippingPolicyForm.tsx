import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import ShippingPolicyBasicInfo from './ShippingPolicyBasicInfo';
import ShippingPolicyHeader from './ShippingPolicyHeader';
import ShippingPolicyRelatedGoods from './ShippingPolicyRelatedGoods';
import ShippingPolicySetForm from './ShippingPolicySetForm';
import ShippingPolicySetList from './ShippingPolicySetList';

export function ShippingPolicyForm(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box p={4}>
      {/* 헤더 */}
      <ShippingPolicyHeader />

      {/* 기본정보 */}
      <ShippingPolicyBasicInfo />

      {/* 배송가능국가 : 대한민국 부분 - 배송 설정, 배송 옵션, 지역별 배송비 정보 */}
      <ShippingPolicySetList />

      {/* 배송옵션 추가 모달 버튼 */}
      <Button onClick={onOpen}>{isOpen ? '닫기' : '추가하기'}</Button>

      {/* 연결된 상품 */}
      <ShippingPolicyRelatedGoods />

      {/* 배송옵션 추가 모달 */}
      <Modal onClose={onClose} isOpen={isOpen} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>배송 옵션 추가하기</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ShippingPolicySetForm onSubmit={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default ShippingPolicyForm;
