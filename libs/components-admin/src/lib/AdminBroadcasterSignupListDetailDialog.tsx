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
                {broadcasterDetail.agreementFlag ? 'π’μ΄μ©λμ μλ£' : 'βμ΄μ©λμ νμ'}
                <HStack justifyContent="space-between">
                  <Text>μ΄λ©μΌ</Text>
                  <Text>{broadcasterDetail.email}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>μ±λμ£Όμ</Text>
                  <Link href={broadcasterDetail.channels[0]?.url || 'λ―Έλ±λ‘'} isExternal>
                    <HStack>
                      <Text color="blue">
                        {broadcasterDetail.channels[0]?.url || 'λ―Έλ±λ‘'}
                      </Text>
                      <ExternalLinkIcon />
                    </HStack>
                  </Link>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>μ€λ²λ μ΄URL</Text>
                  <Text>{`https://live.ν¬ν¬μΌ.com${broadcasterDetail.overlayUrl}`}</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text>μ λ¬Ό μλ Ήμ§</Text>
                  <Text>
                    {broadcasterDetail.broadcasterAddress &&
                      ` (${broadcasterDetail.broadcasterAddress.postalCode})
                    ${broadcasterDetail.broadcasterAddress.address}
                    ${broadcasterDetail.broadcasterAddress.detailAddress}`}
                  </Text>
                </HStack>
                <Flex direction="column" mt={3}>
                  <Text>μ°λ½μ²</Text>
                  <Text fontSize="xs">κΈ°λ³Έ μ°λ½μ²λ λΈλμ</Text>
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
              <Button onClick={onClose}>λ«κΈ°</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
