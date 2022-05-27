import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Input,
  Flex,
  HStack,
  Select,
  VStack,
} from '@chakra-ui/react';

type AdminCreateCouponDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminCreateCouponDialog(
  props: AdminCreateCouponDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>쿠폰 생성</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex direction="column" h="700px" justifyContent="space-between">
              <Flex direction="column">
                <Text>쿠폰이름</Text>
                <Input />
              </Flex>
              <Flex direction="column">
                <Text>할인방법</Text>
                <Select placeholder="쿠폰 할인 유형">
                  <option value="P">퍼센트</option>
                  <option value="W">원</option>
                </Select>
              </Flex>
              <Flex direction="column">
                <Text>할인영역</Text>
                <Select placeholder="쿠폰 할인 영역">
                  <option value="P">상품할인</option>
                  <option value="W">배송비할인</option>
                </Select>
              </Flex>
              <Flex direction="column">
                <Text>할인상품선택</Text>
                <Select placeholder="쿠폰 할인 상품 선택">
                  <option value="P">모든상품</option>
                  <option value="W">선택한 상품</option>
                  <option value="W">특정 상품 제외</option>
                </Select>
              </Flex>
              <Flex direction="column">
                <Text>시작날짜</Text>
                <Input type="date" />
                <Text>종료날짜</Text>
                <Input type="date" />
              </Flex>
              <Flex direction="column">
                <Text>최대할인금액</Text>
                <Input />
                <Text>최소 주문액</Text>
                <Input />
              </Flex>
              <Flex direction="column">
                <Text>메모</Text>
                <Input />
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
