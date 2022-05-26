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
  Link,
  HStack,
  Avatar,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { BroadcasterContacts } from '@prisma/client';
import { adminBroadcasterListStore } from '@project-lc/stores';

type AdminBroadcasterListDetailDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AdminBroadcasterSignupListDetailDialog(
  props: AdminBroadcasterListDetailDialogProps,
): JSX.Element {
  const { isOpen, onClose } = props;
  const { broadcasterDetail } = adminBroadcasterListStore();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        {broadcasterDetail && (
          <>
            <ModalHeader>
              <Avatar src={broadcasterDetail.avatar || ''} size="xs" mr={3} />
              {broadcasterDetail.userNickname}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction="column" h={300} justifyContent="space-between">
                {broadcasterDetail.agreementFlag ? '🟢이용동의 완료' : '❗이용동의 필요'}
                <HStack justifyContent="space-between">
                  <Text>이메일</Text>
                  <Text>{broadcasterDetail.email}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>채널주소</Text>
                  <Link href={broadcasterDetail.channels[0].url} isExternal>
                    <HStack>
                      <Text color="blue">{broadcasterDetail.channels[0].url}</Text>
                      <ExternalLinkIcon />
                    </HStack>
                  </Link>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>오버레이URL</Text>
                  <Text>{`https://live.크크쇼.com${broadcasterDetail.overlayUrl}`}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>선물 수령지</Text>
                  <Text>
                    {` (${broadcasterDetail.broadcasterAddress.postalCode})
                    ${broadcasterDetail.broadcasterAddress.address}
                    ${broadcasterDetail.broadcasterAddress.detailAddress}`}
                  </Text>
                </HStack>
                <Flex direction="column" mt={3}>
                  <Text>연락처</Text>
                  <Text fontSize="xs">기본 연락처는 노란색</Text>
                  <HStack m={2}>
                    {broadcasterDetail.broadcasterContacts.map(
                      (item: BroadcasterContacts) => (
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
                      ),
                    )}
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
