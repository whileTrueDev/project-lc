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
import { CustomerAddress } from '@prisma/client';
import SectionWithTitle from '@project-lc/components-layout/SectionWithTitle';
import {
  getOrderShippingCheck,
  useDefaultCustomerAddress,
  useGetOrderShippingCheck,
  useProfile,
} from '@project-lc/hooks';
import { OrderDetailRes, CreateOrderForm } from '@project-lc/shared-types';
import { useKkshowOrderStore } from '@project-lc/stores';
import { useCallback, useEffect } from 'react';
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

  const { addressType, handleAddressType, setShippingData } = useKkshowOrderStore();

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
  } = useFormContext<CreateOrderForm>();

  function handleRadio(value: string): void {
    handleAddressType(value);
    if (value === 'manual') {
      resetField('recipientName');
      resetField('recipientPostalCode');
      resetField('recipientAddress');
      resetField('recipientDetailAddress');
      resetField('recipientPhone1');
      resetField('recipientPhone2');
      resetField('recipientPhone3');
      resetField('memo');
    }
    if (value === 'default') {
      setDefaultAddressData(defaultAddress);
    }
  }

  const setDefaultAddressData = useCallback(
    (_defaultAddress?: CustomerAddress): void => {
      if (_defaultAddress) {
        const phone1 = _defaultAddress.phone?.slice(0, 3);
        const phone2 = _defaultAddress.phone?.slice(3, 7);
        const phone3 = _defaultAddress.phone?.slice(7, 12);
        setValue('recipientName', _defaultAddress.recipient || '');
        setValue('recipientPhone1', phone1 || '');
        setValue('recipientPhone2', phone2 || '');
        setValue('recipientPhone3', phone3 || '');
        setValue('recipientPostalCode', _defaultAddress.postalCode || '');
        setValue('recipientAddress', _defaultAddress.address || '');
        setValue('recipientDetailAddress', _defaultAddress.detailAddress || '');
        setValue('memo', _defaultAddress.memo || '');
      }
    },
    [setValue],
  );

  const handleRecipientInfo = async (): Promise<void> => {
    setValue('recipientName', getValues('ordererName'));
    const ordererPhone1 = getValues('ordererPhone1');
    const ordererPhone2 = getValues('ordererPhone2');
    const ordererPhone3 = getValues('ordererPhone3');
    setValue('recipientPhone1', ordererPhone1 || '');
    setValue('recipientPhone2', ordererPhone2 || '');
    setValue('recipientPhone3', ordererPhone3 || '');
    await trigger('recipientName');
    await trigger('recipientPhone1');
    await trigger('recipientPhone2');
    await trigger('recipientPhone3');
  };

  // * 맨 처음 렌더링시 기본배송지 정보 있으면 addressType을 default로 설정하고 기본배송지정보를 표시한다
  useEffect(() => {
    if (!isLoading && defaultAddress) {
      // addressType을 default로 설정
      handleAddressType('default');
      // 기본배송지정보를 표시
      setDefaultAddressData(defaultAddress);
    }
  }, [defaultAddress, handleAddressType, isLoading, setDefaultAddressData]);

  // * 배송지 주소 변경시 배송비를 다시 계산한다
  // const shippingCheck = useGetOrderShippingCheck();
  const address = watch('recipientAddress');
  const postalCode = watch('recipientPostalCode');
  useEffect(() => {
    if (address) {
      console.log('address change');
      const params = {
        address,
        postalCode,
        isGiftOrder: getValues('giftFlag') || false,
        items: getValues('orderItems')
          .flatMap((i) => {
            return i.options.map((opt) => ({ ...opt, goodsId: i.goodsId }));
          })
          .map((opt) => ({
            goodsId: opt.goodsId,
            goodsOptionId: opt.goodsOptionId,
            quantity: opt.quantity,
          })),
      };

      // 배송비 조회 요청
      if (params.items.length > 0) {
        getOrderShippingCheck(params)
          .then((res) => {
            if (res) {
              setShippingData(res);
            }
          })
          .catch((e) => console.error(e));
      }
    }
  }, [address, getValues, postalCode, setShippingData]);

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
      {!isLoading && (
        <Stack mt={4}>
          <FormControl isInvalid={!!errors.recipientName}>
            <Flex direction="column">
              <Text fontWeight="semibold">수령인</Text>
              <Box>
                <Input
                  w={{ base: '100%', md: '15%' }}
                  placeholder="수령인"
                  {...register('recipientName', {
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
                {errors.recipientName && errors.recipientName.message}
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
            isInvalid={
              !!errors.recipientPostalCode ||
              !!errors.recipientAddress ||
              !!errors.recipientDetailAddress
            }
          >
            <Flex direction="column" alignItems="flex-start">
              <Text fontWeight="semibold">배송지주소</Text>
              <Flex direction="column" mb={2}>
                <HStack>
                  <Input
                    isReadOnly
                    w="15"
                    placeholder="우편번호"
                    {...register('recipientPostalCode', {
                      required: { value: true, message: '우편번호를 입력해주세요' },
                    })}
                  />
                  <Button size="sm" onClick={addressOnOpen}>
                    주소찾기
                  </Button>
                </HStack>
                <FormErrorMessage mt={0}>
                  {errors.recipientPostalCode && errors.recipientPostalCode.message}
                </FormErrorMessage>
              </Flex>
              <Flex direction="column" w="100%">
                <Flex direction="column" mb={2}>
                  <Input
                    w={{ base: '100%', md: '50%' }}
                    isReadOnly
                    placeholder="기본주소"
                    {...register('recipientAddress', {
                      required: { value: true, message: '주소를 입력해주세요' },
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.recipientAddress && errors.recipientAddress.message}
                  </FormErrorMessage>
                </Flex>
                <Flex direction="column">
                  <Input
                    w={{ base: '100%', md: '50%' }}
                    placeholder="상세주소"
                    {...register('recipientDetailAddress', {
                      required: { value: true, message: '상세주소를 입력해주세요' },
                      maxLength: {
                        value: 30,
                        message: '30자 이상 작성할 수 없습니다.',
                      },
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.recipientDetailAddress &&
                      errors.recipientDetailAddress.message}
                  </FormErrorMessage>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>

          <FormControl isInvalid={!!errors.memo}>
            <Text fontWeight="semibold">배송메모</Text>

            <Input
              w={{ base: '100%', md: '50%' }}
              placeholder="문 앞 / 직접 받고 부재 시 문 앞 / 경비실 / 택배함"
              {...register('memo', {
                required: '배송메모를 입력해주세요.',
                maxLength: {
                  value: 30,
                  message: '30자 이상 작성할 수 없습니다.',
                },
              })}
            />
            <FormErrorMessage mt={0}>{errors.memo?.message}</FormErrorMessage>
          </FormControl>
        </Stack>
      )}
      <DeliveryAddressDialog isOpen={addressIsOpen} onClose={addressOnClose} />
      <DeliveryAddressList isOpen={addressListIsOpen} onClose={addressListOnClose} />
    </SectionWithTitle>
  );
}

export type SuccessDeliveryAddressProps = { data: OrderDetailRes };

export function SuccessDeliveryAddress(props: SuccessDeliveryAddressProps): JSX.Element {
  const { data } = props;
  return (
    <>
      <Flex direction="column" mt={3}>
        <Text fontWeight="bold">수령인</Text>
        <Text>{data.recipientName}</Text>
      </Flex>
      <Flex direction="column" mt={3}>
        <Text fontWeight="bold">연락처</Text>
        <HStack>
          <Text>{`${data.recipientPhone}`}</Text>
        </HStack>
      </Flex>
      <Flex direction="column" alignItems="flex-start" mt={3}>
        <Text fontWeight="bold">배송지주소</Text>
        <Flex direction="column">
          <Text>
            ({data.recipientPostalCode}) {data.recipientAddress}
          </Text>
          <Text>{data.recipientDetailAddress}</Text>
        </Flex>
      </Flex>
    </>
  );
}
