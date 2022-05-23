import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import { useDefaultCustomerAddress, useProfile } from '@project-lc/hooks';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useKkshowOrder } from '@project-lc/stores';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { DeliveryAddressDialog } from './DeliveryAddressDialog';
import { DeliveryAddressList } from './DeliveryAddressList';

export function DeliveryAddress(): JSX.Element {
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

  const { addressType, handleAddressType } = useKkshowOrder();

  const { data: profile } = useProfile();
  const { data: defaultAddress, isLoading } = useDefaultCustomerAddress(profile?.id);

  const {
    register,
    setValue,
    watch,
    getValues,
    resetField,
    trigger,
    formState: { errors },
  } = useFormContext<PaymentPageDto>();
  /**
   * TODO: 배송지 정보 OrderCreateDto 사용하도록 수정 필요
   */
  function handleRadio(value: string): void {
    handleAddressType(value);
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

  const handleRecipientInfo = async (): Promise<void> => {
    setValue('recipient', getValues('name'));
    setValue('recipientPhone1', getValues('orderPhone1') || '');
    setValue('recipientPhone2', getValues('orderPhone2') || '');
    setValue('recipientPhone3', getValues('orderPhone3') || '');
    await trigger('recipient');
    await trigger('recipientPhone1');
    await trigger('recipientPhone2');
    await trigger('recipientPhone3');
  };

  useEffect(() => {
    if (!isLoading && defaultAddress) {
      handleAddressType('default');
      setValue('recipient', defaultAddress.recipient!);
      setValue('recipientPhone', defaultAddress.phone!);
      setValue('postalCode', defaultAddress.postalCode!);
      setValue('address', defaultAddress.address!);
      setValue('detailAddress', defaultAddress.detailAddress!);
    }
  }, [defaultAddress, isLoading]);

  return (
    <SectionWithTitle title="배송지 정보">
      {!isLoading && (
        <RadioGroup onChange={(value) => handleRadio(value)} value={addressType}>
          <Stack direction="row">
            {profile && (
              <>
                <Button onClick={addressListOnOpen} size="sm" variant="outline">
                  배송지 목록에서 선택
                </Button>
                <Radio value="default">기본배송지</Radio>
              </>
            )}
            <Radio value="manual">직접입력</Radio>
          </Stack>
        </RadioGroup>
      )}
      {!isLoading && addressType === 'default' && (
        <>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">수령인</Text>
            <Text>{`${defaultAddress?.recipient}`}</Text>
          </Flex>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">연락처</Text>
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
            <Text fontWeight="semibold">배송지주소</Text>
            <Flex direction="column">
              <Text>{`(${defaultAddress?.postalCode}) ${defaultAddress?.address}`}</Text>
              <Text>{`${defaultAddress?.detailAddress}`}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">배송메모</Text>
            <HStack>
              <Text>{defaultAddress?.memo}</Text>
            </HStack>
          </Flex>
        </>
      )}
      {!isLoading && addressType === 'list' && (
        <>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">수령인</Text>
            <Text>{`${getValues('recipient')}`}</Text>
          </Flex>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">연락처</Text>
            <HStack>
              <Text>
                {`${getValues('recipientPhone').slice(0, 3)} - ${getValues(
                  'recipientPhone',
                ).slice(3, 7)} - ${getValues('recipientPhone').slice(7, 11)}`}
              </Text>
            </HStack>
          </Flex>
          <Flex direction="column" alignItems="flex-start" mt={3}>
            <Text fontWeight="semibold">배송지주소</Text>
            <Flex direction="column">
              <Text>{`(${getValues('postalCode')}) ${getValues('address')}`}</Text>
              <Text>{`${getValues('detailAddress')}`}</Text>
            </Flex>
          </Flex>
          <Flex direction="column" mt={3}>
            <Text fontWeight="semibold">배송메모</Text>
            <HStack>
              <Text>{getValues('deliveryMemo')}</Text>
            </HStack>
          </Flex>
        </>
      )}

      {!isLoading && addressType === 'manual' && (
        <>
          <FormControl isInvalid={!!errors.recipient}>
            <Flex direction="column">
              <Text fontWeight="semibold">수령인</Text>
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
                <Button size="xs" onClick={() => handleRecipientInfo()}>
                  구매자와 동일
                </Button>
              </Box>
              <FormErrorMessage mt={0}>
                {errors.recipient && errors.recipient.message}
              </FormErrorMessage>
            </Flex>
          </FormControl>
          <Flex direction="column">
            <Text fontWeight="semibold">연락처</Text>
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
              <FormErrorMessage mt={0}>
                휴대전화 번호를 올바르게 입력해주세요.
              </FormErrorMessage>
            </FormControl>
          </Flex>
          <FormControl
            isInvalid={!!errors.postalCode || !!errors.address || !!errors.detailAddress}
          >
            <Flex direction="column" alignItems="flex-start">
              <Text fontWeight="semibold">배송지주소</Text>
              <Flex direction="column" mb={2}>
                <HStack>
                  <Input
                    isReadOnly
                    w="15"
                    placeholder="우편번호"
                    value={getValues('postalCode')}
                    {...register('postalCode', {
                      required: { value: true, message: '우편번호를 입력해주세요' },
                    })}
                  />
                  <Button size="sm" onClick={addressOnOpen}>
                    주소찾기
                  </Button>
                </HStack>
                <FormErrorMessage mt={0}>
                  {errors.postalCode && errors.postalCode.message}
                </FormErrorMessage>
              </Flex>
              <Flex direction="column" w="100%">
                <Flex direction="column" mb={2}>
                  <Input
                    w={{ base: '100%', md: '50%' }}
                    isReadOnly
                    placeholder="기본주소"
                    value={getValues('address')}
                    {...register('address', {
                      required: { value: true, message: '주소를 입력해주세요' },
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.address && errors.address.message}
                  </FormErrorMessage>
                </Flex>
                <Flex direction="column">
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
                  <FormErrorMessage mt={0}>
                    {errors.detailAddress && errors.detailAddress.message}
                  </FormErrorMessage>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>

          <FormControl isInvalid={!!errors.deliveryMemo}>
            <Text fontWeight="semibold">배송메모</Text>

            <Input
              w={{ base: '100%', md: '50%' }}
              placeholder="문 앞 / 직접 받고 부재 시 문 앞 / 경비실 / 택배함"
              {...register('deliveryMemo', {
                required: '배송메모를 입력해주세요.',
                maxLength: {
                  value: 30,
                  message: '30자 이상 작성할 수 없습니다.',
                },
              })}
            />
            <FormErrorMessage mt={0}>{errors.deliveryMemo?.message}</FormErrorMessage>
          </FormControl>
        </>
      )}

      <DeliveryAddressDialog isOpen={addressIsOpen} onClose={addressOnClose} />
      <DeliveryAddressList isOpen={addressListIsOpen} onClose={addressListOnClose} />
    </SectionWithTitle>
  );
}
