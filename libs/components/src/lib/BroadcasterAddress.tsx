import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import { useRef } from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

export function BroadcasterAddressSection(): JSX.Element {
  return (
    <SettingSectionLayout title="샘플 및 선물 수령 주소">
      <BroadcasterAddressForm />
    </SettingSectionLayout>
  );
}

interface BroadcasterAdrressDto {
  postalCode: string;
  address: string;
  detailAddress: string;
}
export function BroadcasterAddressForm(): JSX.Element {
  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<BroadcasterAdrressDto>();
  const registered = register('address', {
    required: {
      value: true,
      message: '주소를 선택해 주세요.',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registered.ref, inputRef);

  function onSubmit(formData: BroadcasterAdrressDto): void {
    console.log(formData);
  }

  const editMode = useDisclosure();
  const daumOpen = useDisclosure();

  function handleAddressSelected(addressData: AddressData): void {
    const { zonecode, address, buildingName } = addressData;
    const addr = buildingName ? `${address} (${buildingName})` : address;
    setValue('address', addr);
    clearErrors('address');
    setValue('postalCode', zonecode);
    daumOpen.onClose();
  }
  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)} w="100%">
      {!editMode.isOpen ? (
        <Stack spacing={3}>
          <Text>주소주소주소주소주소주소주소주소주소주소주소주소주소주소주소주소</Text>
          <Box>
            <Button onClick={editMode.onOpen}>수정</Button>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Stack>
            <FormControl isInvalid={!!errors.address}>
              <InputGroup>
                {watch('postalCode') && (
                  <InputLeftAddon>{watch('postalCode')}</InputLeftAddon>
                )}
                <Input
                  maxW="360px"
                  readOnly
                  onClick={daumOpen.onOpen}
                  placeholder="주소 찾기를 클릭하여 주소를 선택해주세요"
                  {...registered}
                  ref={mergedRef}
                />
                <Button ml={2} onClick={daumOpen.onToggle}>
                  {daumOpen.isOpen ? '닫기' : '찾기'}
                </Button>
              </InputGroup>
              {errors.address && (
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              )}
            </FormControl>

            {watch('address') && (
              <FormControl isInvalid={!!errors.detailAddress}>
                <Input
                  maxW="180px"
                  placeholder="상세주소"
                  {...register('detailAddress', {
                    required: {
                      message: '상세주소를 입력해주세요.',
                      value: true,
                    },
                    maxLength: {
                      value: 30,
                      message: '30자 이상 작성할 수 없습니다.',
                    },
                  })}
                />
                <FormErrorMessage>{errors.detailAddress?.message}</FormErrorMessage>
              </FormControl>
            )}
          </Stack>
          <Collapse in={daumOpen.isOpen} animateOpacity>
            <Box mt={4}>
              <DaumPostcode onComplete={handleAddressSelected} />
            </Box>
          </Collapse>

          <ButtonGroup>
            <Button type="submit">변경</Button>
            <Button
              onClick={() => {
                editMode.onClose();
                reset();
                if (daumOpen.isOpen) daumOpen.onClose();
              }}
            >
              취소
            </Button>
          </ButtonGroup>
        </Stack>
      )}
    </Stack>
  );
}
