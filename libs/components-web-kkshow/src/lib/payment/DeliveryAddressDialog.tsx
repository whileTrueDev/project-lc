import {
  Box,
  Button,
  ButtonGroup,
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
  useToast,
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
  const toast = useToast();
  const { setValue, clearErrors, trigger } = useFormContext<PaymentPageDto>();

  const handleAddressSelected = (addressData: AddressData): void => {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    clearErrors('address');
    setPostalCode(zonecode);
    setAddress(addr);
    daumOpen.onClose();
  };

  const handleModalOnSuccess = async (): Promise<void> => {
    if (detailAddress) {
      setValue('address', address);
      setValue('postalCode', postalCode);
      setValue('detailAddress', detailAddress);
      setPostalCode('');
      setAddress('');
      setDetailAddress('');
      await trigger('address');
      await trigger('postalCode');
      await trigger('detailAddress');
      onClose();
    } else {
      toast({
        title: '상세주소를 입력해주세요',
        status: 'error',
        position: 'top',
      });
    }
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
                  <InputLeftAddon fontWeight="bold">({postalCode})</InputLeftAddon>
                </HStack>
              )}
              {address && (
                <>
                  <HStack>
                    <InputLeftAddon fontWeight="bold">{address}</InputLeftAddon>
                  </HStack>
                  <HStack>
                    <Input
                      maxW="280px"
                      placeholder="상세주소를 입력해주세요"
                      onChange={(e) => setDetailAddress(e.target.value)}
                    />
                  </HStack>
                </>
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
