import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Flex,
  Text,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { adminCustomerListStore } from '@project-lc/stores';
import { CustomerAddress } from '@prisma/client';

type AdminBroadcasterListDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminCustomerSignupListDetailDialog(
  props: AdminBroadcasterListDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  const { customerDetail } = adminCustomerListStore();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        {customerDetail && (
          <>
            <ModalHeader>
              <Flex alignItems="center">
                <Avatar src={customerDetail.avatar || ''} size="xs" mr={3} />
                {customerDetail.nickname}
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" h={300} justifyContent="space-evenly">
                {customerDetail.agreementFlag ? '🟢이용동의 완료' : '❗이용동의 필요'}
                <HStack justifyContent="space-between">
                  <Text>이메일</Text>
                  <Text>{customerDetail.email}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>휴대전화</Text>
                  <Text>{customerDetail.phone}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>보유 쿠폰수</Text>
                  <Text>{customerDetail.coupons.length}개</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>보유 마일리지</Text>
                  <Text>{customerDetail.mileage?.mileage.toLocaleString() || 0}원</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>작성한 리뷰수</Text>
                  <Text>{customerDetail.goodsReview.length}개</Text>
                </HStack>
                <Flex direction="column" justifyContent="space-between">
                  <Text>주소록</Text>
                  {customerDetail.addresses.map((item: CustomerAddress) => (
                    <Flex
                      key={item.id}
                      direction="column"
                      bgColor={item.isDefault ? 'yellow.300' : 'inherit'}
                      p={1}
                      borderRadius="3px"
                    >
                      <Text>({item.postalCode})</Text>
                      <Text>{item.address}</Text>
                      <Text>{item.detailAddress}</Text>
                    </Flex>
                  ))}
                </Flex>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <Button onClick={onClose}>닫기</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
