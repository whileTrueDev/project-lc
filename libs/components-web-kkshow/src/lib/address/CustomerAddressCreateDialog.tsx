import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  ButtonGroup,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import {
  useCustomerAddress,
  useCustomerAddressMutation,
  useProfile,
} from '@project-lc/hooks';
import { CustomerAddressDto } from '@project-lc/shared-types';
import CustomerAddressForm from './CustomerAddressForm';

interface CustomerAddressCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CustomerAddressCreateDialog({
  isOpen,
  onClose,
}: CustomerAddressCreateDialogProps): JSX.Element {
  const toast = useToast();
  const { data: profile } = useProfile();
  const mutation = useCustomerAddressMutation();

  const handleCustomerAddressSubmit = (formData: CustomerAddressDto): void => {
    if (!profile?.id) return;
    mutation
      .mutateAsync({ customerId: profile?.id, ...formData })
      .then(() => {
        toast({
          status: 'success',
          description: '배송지가 생성되었습니다.',
        });
        onClose();
      })
      .catch(() => {
        toast({
          status: 'error',
          description: '배송지 생성중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        });
      });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size="xl"
      closeOnOverlayClick={false}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>배송지 등록</ModalHeader>
        <ModalBody>
          <CustomerAddressForm onSubmit={handleCustomerAddressSubmit} />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isLoading={mutation.isLoading}
              form="customer-contacts-form"
              type="submit"
              colorScheme="blue"
            >
              등록
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CustomerAddressCreateDialog;

export function CustomerAddressCreateButton(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data: profile } = useProfile();
  const { data: addresses } = useCustomerAddress(profile?.id);

  return (
    <Box>
      <Button
        size="sm"
        leftIcon={<AddIcon />}
        onClick={onOpen}
        isDisabled={addresses && addresses.length >= 3}
      >
        배송지 등록
      </Button>
      <UnorderedList fontSize="xs">
        <ListItem>
          <Text color="red.400">현재 배송지를 최대로 등록했습니다.</Text>
        </ListItem>
        {addresses && addresses.length >= 3 && (
          <ListItem>
            <Text>배송지는 최대 3개 까지 등록 가능합니다.</Text>
          </ListItem>
        )}
      </UnorderedList>

      <CustomerAddressCreateDialog isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
