import {
  Box,
  Heading,
  Flex,
  HStack,
  Text,
  Divider,
  Button,
  useDisclosure,
  Input,
  Radio,
  RadioGroup,
  Stack,
  FormErrorMessage,
  FormControl,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDefaultCustomerAddress, useProfile } from '@project-lc/hooks';
import { useFormContext } from 'react-hook-form';
import { PaymentPageDto } from '@project-lc/shared-types';
import { DeliveryAddressDialog } from './DeliveryAddress';
import { DeliveryAddressList } from './DeliveryAddressList';

export function DestinationInfo(): JSX.Element {
  const {
    isOpen: addressListIsOpen,
    onClose: addressListOnClose,
    onOpen: addressListOnOpen,
  } = useDisclosure();
  const {
    isOpen: addressIsOpen,
    onClose: addressOnClose,
    onOpen: addressOnOpen,
  } = useDisclosure();

  const [checked, setChecked] = useState('manual');
  const { data: profile } = useProfile();
  const { data: defaultAddress, isLoading } = useDefaultCustomerAddress(
    profile?.id || undefined,
  );

  const {
    register,
    setValue,
    watch,
    getValues,
    resetField,
    formState: { errors },
  } = useFormContext<PaymentPageDto>();

  function handleRadio(value: string): void {
    setChecked(value);
    if (value === 'manual') {
      resetField('recipient');
      resetField('postalCode');
      resetField('address');
      resetField('detailAddress');
      resetField('recipientPhone1');
      resetField('recipientPhone2');
      resetField('recipientPhone3');
    }
  }

  const handleRecipientInfo = (): void => {
    setValue('recipient', getValues('name'));
    setValue('recipientPhone1', getValues('orderPhone1') || '');
    setValue('recipientPhone2', getValues('orderPhone2') || '');
    setValue('recipientPhone3', getValues('orderPhone3') || '');
  };

  useEffect(() => {
    if (!isLoading && defaultAddress) {
      setChecked('default');
      setValue('recipient', defaultAddress.recipient!);
      setValue('recipientPhone', defaultAddress.phone!);
      setValue('postalCode', defaultAddress.postalCode!);
      setValue('address', defaultAddress.address!);
      setValue('detailAddress', defaultAddress.detailAddress!);
    }
  }, []);

  return (
    <Box>
      <HStack>
        <Heading>배송정보</Heading>
        {profile && (
          <Button onClick={addressListOnOpen} size="sm">
            배송지 목록
          </Button>
        )}
      </HStack>
      <Divider m={2} />
      {!isLoading && (
        <RadioGroup onChange={(value) => handleRadio(value)} value={checked}>
          <Stack direction="row">
            <Radio value="default" isDisabled={!profile?.id}>
              기본배송지
            </Radio>
            <Radio value="manual">직접입력</Radio>
          </Stack>
        </RadioGroup>
      )}
      {!isLoading && checked === 'default' ? (
        <>
          <Flex direction="column" mt={3}>
            <Text fontWeight="bold">수령인</Text>
            <Text>{`${defaultAddress?.recipient}`}</Text>
          </Flex>
          <Flex direction="column" mt={3}>
            <Text fontWeight="bold">연락처</Text>
            <HStack>
              <Text>
                {`${defaultAddress?.phone?.slice(0, 3)} - ${defaultAddress?.phone?.slice(
                  3,
                  7,
                )} - ${defaultAddress?.phone?.slice(7, 11)}`}
              </Text>
            </HStack>
          </Flex>
          <Flex direction="column" alignItems="flex-start" mt={3}>
            <Text fontWeight="bold">배송지주소</Text>
            <Flex direction="column">
              <Text>{`(${defaultAddress?.postalCode}) ${defaultAddress?.address}`}</Text>
              <Text>{`${defaultAddress?.detailAddress}`}</Text>
            </Flex>
          </Flex>
        </>
      ) : (
        <>
          <FormControl isInvalid={!!errors.recipient}>
            <Flex direction="column">
              <Text fontWeight="bold">수령인</Text>
              <Box>
                <Input
                  w={{ base: '100%', md: '15%' }}
                  placeholder="수령인"
                  value={watch('recipient')}
                  {...register('recipient', {
                    required: {
                      value: true,
                      message: '받는사람의 이름을 입력해주세요(2글자 이상)',
                    },
                    minLength: 2,
                  })}
                  mr={1}
                />
                <Button size="xs" onClick={() => handleRecipientInfo()} bg="gray.300">
                  구매자와 동일
                </Button>
              </Box>
              <FormErrorMessage>
                {errors.recipient && errors.recipient.message}
              </FormErrorMessage>
            </Flex>
          </FormControl>
          <Flex direction="column">
            <Text fontWeight="bold">연락처</Text>
            <FormControl
              isInvalid={
                !!errors.recipientPhone1 ||
                !!errors.recipientPhone2 ||
                !!errors.recipientPhone3
              }
            >
              <HStack>
                <Input
                  w={{ base: '20%', md: '15%' }}
                  type="number"
                  maxLength={3}
                  {...register('recipientPhone1', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 2,
                    maxLength: 3,
                  })}
                />
                <Text>-</Text>
                <Input
                  w={{ base: '20%', md: '15%' }}
                  type="number"
                  maxLength={4}
                  {...register('recipientPhone2', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
                <Text>-</Text>
                <Input
                  w={{ base: '20%', md: '15%' }}
                  type="number"
                  maxLength={4}
                  {...register('recipientPhone3', {
                    required: {
                      value: true,
                      message: '휴대전화를 올바르게 입력해주세요.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
              </HStack>
              <FormErrorMessage>휴대전화 번호를 올바르게 입력해주세요.</FormErrorMessage>
            </FormControl>
          </Flex>
          <FormControl
            isInvalid={!!errors.postalCode || !!errors.address || !!errors.detailAddress}
          >
            <Flex direction="column" alignItems="flex-start">
              <Text fontWeight="bold">배송지주소</Text>
              <HStack mt={2} mb={2}>
                <Button size="sm" onClick={addressOnOpen}>
                  주소찾기
                </Button>
                <Input
                  isReadOnly
                  w="15"
                  placeholder="우편번호"
                  value={getValues('postalCode')}
                  {...register('postalCode', {
                    required: { value: true, message: '우편번호가 올바르지 않습니다' },
                  })}
                />
              </HStack>
              <FormErrorMessage>
                {errors.postalCode && errors.postalCode.message}
              </FormErrorMessage>
              <Flex direction="column" w="100%">
                <Input
                  w={{ base: '100%', md: '50%' }}
                  isReadOnly
                  placeholder="기본주소"
                  value={getValues('address')}
                  {...register('address', {
                    required: { value: true, message: '주소를 입력해주세요' },
                  })}
                  mb={2}
                />
                <FormErrorMessage>
                  {errors.address && errors.address.message}
                </FormErrorMessage>
                <Input
                  w={{ base: '100%', md: '50%' }}
                  placeholder="상세주소"
                  value={watch('detailAddress')}
                  {...register('detailAddress', {
                    required: { value: true, message: '상세주소를 입력해주세요' },
                    maxLength: {
                      value: 30,
                      message: '30자 이상 작성할 수 없습니다.',
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.detailAddress && errors.detailAddress.message}
                </FormErrorMessage>
              </Flex>
            </Flex>
          </FormControl>
        </>
      )}
      <DeliveryAddressDialog isOpen={addressIsOpen} onClose={addressOnClose} />
      <DeliveryAddressList isOpen={addressListIsOpen} onClose={addressListOnClose} />
    </Box>
  );
}
