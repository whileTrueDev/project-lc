import { EditIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  useDisclosure,
  useMergeRefs,
  useToast,
} from '@chakra-ui/react';
import { useBroadcaster, useBroadcasterAddressMutation } from '@project-lc/hooks';
import { BroadcasterAddressDto } from '@project-lc/shared-types';
import { useMemo, useRef } from 'react';
import DaumPostcode, { AddressData } from 'react-daum-postcode';
import { useForm } from 'react-hook-form';
import SettingSectionLayout from './SettingSectionLayout';

export function BroadcasterAddressSection(): JSX.Element {
  const broadcaster = useBroadcaster({ id: 1 });
  return (
    <SettingSectionLayout title="샘플 및 선물 수령 주소">
      {!broadcaster.isLoading && !broadcaster.data?.broadcasterAddress?.address && (
        <NoAddressAlertBox />
      )}
      {!broadcaster.isLoading && broadcaster.data?.broadcasterAddress?.address && (
        <Text>상품 샘플과 시청자로부터의 선물을 수령할 주소입니다.</Text>
      )}
      <BroadcasterAddressForm />
    </SettingSectionLayout>
  );
}

function NoAddressAlertBox(): JSX.Element {
  return (
    <Alert status="warning">
      <Stack>
        <HStack spacing={0}>
          <AlertIcon />
          <AlertTitle>입력이 필요합니다!</AlertTitle>
        </HStack>
        <AlertDescription>
          상품 샘플과 시청자로부터의 선물을 수령할 주소를 입력해주세요.
        </AlertDescription>
      </Stack>
    </Alert>
  );
}

export function BroadcasterAddressForm(): JSX.Element {
  const toast = useToast();
  const broadcaster = useBroadcaster({ id: 1 });
  const isBroadcasterAddressExists = useMemo(() => {
    if (!broadcaster.data) return false;
    if (!broadcaster.data.broadcasterAddress) return false;
    return true;
  }, [broadcaster.data]);
  const editMode = useDisclosure({ defaultIsOpen: isBroadcasterAddressExists });
  const daumOpen = useDisclosure();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    watch,
    reset,
    formState: { errors },
  } = useForm<BroadcasterAddressDto>();
  const registered = register('address', {
    required: {
      value: true,
      message: '주소를 선택해 주세요.',
    },
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergeRefs(registered.ref, inputRef);

  const { mutateAsync, isLoading } = useBroadcasterAddressMutation();
  function onSubmit(formData: BroadcasterAddressDto): void {
    const onSuccess = (): void => {
      // 성공시
      reset();
      editMode.onClose();
      toast({ status: 'success', description: '주소가 변경되었습니다.' });
    };
    const onFail = (): void => {
      toast({
        status: 'error',
        description: '주소 변경중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    };
    mutateAsync(formData)
      .then((result) => {
        if (result) onSuccess();
        else onFail();
      })
      .catch((err) => {
        console.log(err);
        onFail();
      });
  }

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
          <BroadcasterAddressPreview address={broadcaster.data?.broadcasterAddress} />
          <Box>
            <Button leftIcon={<EditIcon />} onClick={editMode.onOpen}>
              {isBroadcasterAddressExists ? '수정' : '등록'}
            </Button>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={3}>
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
                  maxLength: {
                    value: 30,
                    message: '30자 이상 작성할 수 없습니다.',
                  },
                })}
              />
              <FormErrorMessage>{errors.detailAddress?.message}</FormErrorMessage>
            </FormControl>
          )}
          <Collapse in={daumOpen.isOpen} animateOpacity>
            <DaumPostcode onComplete={handleAddressSelected} />
          </Collapse>

          <ButtonGroup>
            <Button type="submit" isLoading={isLoading}>
              확인
            </Button>
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
