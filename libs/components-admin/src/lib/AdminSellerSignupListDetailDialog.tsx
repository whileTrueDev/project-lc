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
import { BroadcasterContacts } from '@prisma/client';
import { adminSellerListStore } from '@project-lc/stores';
import { ConfirmationBadge } from './AdminBusinessRegistrationList';

type AdminBroadcasterListDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminSellerSignupListDetailDialog(
  props: AdminBroadcasterListDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  const { sellerDetail } = adminSellerListStore();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        {sellerDetail && (
          <>
            <ModalHeader>
              <Flex alignItems="center">
                <Avatar src={sellerDetail.avatar || ''} size="xs" mr={3} />
                {sellerDetail.sellerShop.shopName}
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" h={300}>
                {sellerDetail.agreementFlag ? '🟢이용동의 완료' : '❗이용동의 필요'}
                <HStack justifyContent="space-between">
                  <Text>이메일</Text>
                  <Text>{sellerDetail.email}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>계좌번호</Text>
                  <Text>
                    {`${sellerDetail.sellerSettlementAccount[0].bank} - ${sellerDetail.sellerSettlementAccount[0].number}`}
                  </Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>사업자등록증</Text>
                  <ConfirmationBadge
                    status={
                      sellerDetail.sellerBusinessRegistration[0]
                        .BusinessRegistrationConfirmation.status
                    }
                  />
                </HStack>
                <Flex direction="column" mt={3}>
                  <Text>연락처</Text>
                  <Text fontSize="xs">기본 연락처는 노란색</Text>
                  <HStack m={2}>
                    {sellerDetail.SellerContacts.map((item: BroadcasterContacts) => (
                      <Flex
                        key={item.id}
                        direction="column"
                        bgColor={item.isDefault ? 'yellow.300' : 'inherit'}
                        p={1}
                        borderRadius="3px"
                      >
                        <Text>{item.name}</Text>
                        <Text>{item.email}</Text>
                        <Text>{item.phoneNumber}</Text>
                      </Flex>
                    ))}
                  </HStack>
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
