import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputLeftAddon,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import { PaymentPageDto } from '@project-lc/shared-types';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useFormContext } from 'react-hook-form';
import { useState } from 'react';

export function DeliveryAddressDialog({
  defaultOpen,
  isOpen,
  onClose,
}: {
  defaultOpen?: boolean;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const daumOpen = useDisclosure();

  const {
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<PaymentPageDto>();

  const handleAddressSelected = (addressData: AddressData): void => {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    clearErrors('address');
    setPostalCode(zonecode);
    setAddress(addr);
    daumOpen.onClose();
  };

  const handleModalOnSuccess = (): void => {
    setValue('address', address);
    setValue('postalCode', postalCode);
    setValue('detailAddress', detailAddress);
    setPostalCode('');
    setAddress('');
    setDetailAddress('');
    onClose();
  };

  const handleModalOnClose = (): void => {
    setPostalCode('');
    setAddress('');
    setDetailAddress('');
    onClose();
  };

  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  return (
    <Modal isOpen={isOpen} onClose={handleModalOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Stack w="100%">
            <Stack spacing={3}>
              <DaumPostcode focusContent focusInput onComplete={handleAddressSelected} />
              {postalCode && (
                <HStack>
                  <Text>우편번호</Text>
                  <InputLeftAddon fontWeight="bold">{watch('postalCode')}</InputLeftAddon>
                </HStack>
              )}
              {address && (
                <FormControl isInvalid={!!errors.detailAddress}>
                  <HStack>
                    <Text>기본주소</Text>
                    <InputLeftAddon fontWeight="bold">{watch('address')}</InputLeftAddon>
                  </HStack>
                  <HStack>
                    <Text>상세주소</Text>
                    <Input
                      maxW="280px"
                      placeholder="상세주소"
                      onChange={(e) => setDetailAddress(e.target.value)}
                    />
                  </HStack>
                  <FormErrorMessage>{errors.detailAddress?.message}</FormErrorMessage>
                </FormControl>
              )}

              <ButtonGroup>
                <Button colorScheme="blue" onClick={() => handleModalOnSuccess()}>
                  확인
                </Button>
                <Button
                  onClick={() => {
                    handleModalOnClose();
                  }}
                >
                  취소
                </Button>
              </ButtonGroup>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export interface DeliveryAddressPreviewProps {
  address?: {
    postalCode: string;
    address: string;
    detailAddress: string;
  };
}
export function DeliveryAddressPreview({
  address,
}: DeliveryAddressPreviewProps): JSX.Element | null {
  if (!address) return null;
  return (
    <Box borderWidth="thin" p={2}>
      <Text>({address.postalCode})</Text>
      <Text>{address.address}</Text>
      <Text>{address.detailAddress}</Text>
    </Box>
  );
}
