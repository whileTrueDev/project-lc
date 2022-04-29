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
  useMergeRefs,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from '@chakra-ui/react';
import SettingSectionLayout from '@project-lc/components-layout/SettingSectionLayout';
import {
  useBroadcaster,
  useBroadcasterAddressMutation,
  useProfile,
} from '@project-lc/hooks';
import { BroadcasterAddressDto } from '@project-lc/shared-types';
import { parseErrorObject } from '@project-lc/utils-frontend';
import { useMemo, useRef } from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useForm, useFormContext } from 'react-hook-form';

export function DeliveryAddressDialog({
  defaultOpen,
  isOpen,
  onClose,
}: {
  defaultOpen?: boolean;
  isOpen: boolean;
  onClose: () => void;
}): JSX.Element {
  const toast = useToast();
  const profile = useProfile();
  const broadcaster = useBroadcaster({ id: profile.data?.id });
  const isBroadcasterAddressExists = useMemo(() => {
    if (!broadcaster.data) return false;
    if (!broadcaster.data.broadcasterAddress) return false;
    return true;
  }, [broadcaster.data]);
  const editMode = useDisclosure({
    defaultIsOpen: defaultOpen,
  });
  const daumOpen = useDisclosure();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useFormContext<any>();
  const registered = register('address', {
    required: {
      value: true,
      message: '주소를 선택해 주세요.',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registered.ref, inputRef);

  function onSubmit(formData: BroadcasterAddressDto): void {
    const onSuccess = (): void => {
      // 성공시
      reset();
      editMode.onClose();
      toast({ status: 'success', description: '주소가 변경되었습니다.' });
    };
    const onFail = (err?: any): void => {
      const { status, message } = parseErrorObject(err);
      toast({
        status: 'error',
        description: status ? `code: ${status} - message: ${message}` : undefined,
        title: '주소 변경중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    };
    console.log(getValues('address'));
    onClose();
  }

  const handleAddressSelected = (addressData: AddressData): void => {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    setValue('address', addr);
    clearErrors('address');
    setValue('postalCode', zonecode);
    daumOpen.onClose();
  };

  const handleModalOnClose = (): void => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalOnClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
            <Stack spacing={3}>
              <DaumPostcode focusContent focusInput onComplete={handleAddressSelected} />
              {watch('postalCode') && (
                <HStack>
                  <Text>우편번호</Text>
                  <InputLeftAddon fontWeight="bold">{watch('postalCode')}</InputLeftAddon>
                </HStack>
              )}
              {watch('address') && (
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
                      {...register('detailAddress', {
                        maxLength: {
                          value: 30,
                          message: '30자 이상 작성할 수 없습니다.',
                        },
                      })}
                    />
                  </HStack>
                  <FormErrorMessage>{errors.detailAddress?.message}</FormErrorMessage>
                </FormControl>
              )}

              <ButtonGroup>
                <Button colorScheme="blue" type="submit">
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

export interface BroadcasterAddressPreviewProps {
  address?: {
    postalCode: string;
    address: string;
    detailAddress: string;
  };
}
export function BroadcasterAddressPreview({
  address,
}: BroadcasterAddressPreviewProps): JSX.Element | null {
  if (!address) return null;
  return (
    <Box borderWidth="thin" p={2}>
      <Text>({address.postalCode})</Text>
      <Text>{address.address}</Text>
      <Text>{address.detailAddress}</Text>
    </Box>
  );
}
