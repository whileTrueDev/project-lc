import { AddIcon } from '@chakra-ui/icons';
import {
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { CustomerAddressDto } from '@project-lc/shared-types';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { SubmitHandler, useForm } from 'react-hook-form';

export function CustomerAddressCreateButton(): JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Button size="sm" leftIcon={<AddIcon />} onClick={onOpen}>
        배송지등록하기
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>배송지 등록</ModalHeader>
          <ModalBody>
            <CustomerAddressForm />
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>닫기</Button>
              <Button form="customer-contacts-form" type="submit" colorScheme="blue">
                등록
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export function CustomerAddressForm(): JSX.Element {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<CustomerAddressDto>();
  const daumOpen = useDisclosure();
  const onSubmit: SubmitHandler<CustomerAddressDto> = (formData): void => {
    console.log(formData);
  };

  const handleAddressSelected = (addressData: AddressData): void => {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    setValue('address', addr);
    clearErrors('address');
    setValue('postalCode', zonecode);
    daumOpen.onClose();
  };
  return (
    <Stack
      as="form"
      id="customer-contacts-form"
      onSubmit={handleSubmit(onSubmit)}
      alignItems="flex-start"
    >
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>주소록 별칭</FormLabel>
        <Input {...register('title')} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>수령인</FormLabel>
        <Input {...register('recipient')} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>연락처</FormLabel>
        <Input {...register('phone')} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <Button onClick={daumOpen.onToggle}>{daumOpen.isOpen ? '닫기' : '찾기'}</Button>
        <Collapse in={daumOpen.isOpen} animateOpacity unmountOnExit>
          <DaumPostcode focusContent focusInput onComplete={handleAddressSelected} />
        </Collapse>
      </FormControl>
      <FormControl isInvalid={!!errors.title}>
        <FormLabel>배송메모</FormLabel>
        <Input {...register('memo')} />
        <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
      </FormControl>
    </Stack>
  );
}

export default CustomerAddressForm;
