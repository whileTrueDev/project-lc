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
                {customerDetail.agreementFlag ? 'π’μ΄μ©λμ μλ£' : 'βμ΄μ©λμ νμ'}
                <HStack justifyContent="space-between">
                  <Text>μ΄λ©μΌ</Text>
                  <Text>{customerDetail.email}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>ν΄λμ ν</Text>
                  <Text>{customerDetail.phone}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>λ³΄μ  μΏ ν°μ</Text>
                  <Text>{customerDetail.coupons.length}κ°</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>λ³΄μ  λ§μΌλ¦¬μ§</Text>
                  <Text>{customerDetail.mileage?.mileage.toLocaleString() || 0}μ</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>μμ±ν λ¦¬λ·°μ</Text>
                  <Text>{customerDetail.goodsReview.length}κ°</Text>
                </HStack>
                <Flex direction="column" justifyContent="space-between">
                  <Text>μ£Όμλ‘</Text>
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
              <Button onClick={onClose}>λ«κΈ°</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
