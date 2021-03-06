import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
  useProfile,
} from '@project-lc/hooks';
import { CreateOrderForm, OrderDetailRes } from '@project-lc/shared-types';
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

  // * ??? ?????? ???????????? ??????????????? ?????? ????????? addressType??? default??? ???????????? ???????????????????????? ????????????
  useEffect(() => {
    if (!isLoading && defaultAddress) {
      // addressType??? default??? ??????
      handleAddressType('default');
      // ???????????????????????? ??????
      setDefaultAddressData(defaultAddress);
    }
  }, [defaultAddress, handleAddressType, isLoading, setDefaultAddressData]);

  // * ????????? ?????? ????????? ???????????? ?????? ????????????
  // const shippingCheck = useGetOrderShippingCheck();
  const address = watch('recipientAddress');
  const postalCode = watch('recipientPostalCode');
  useEffect(() => {
    if (address) {
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

      // ????????? ?????? ??????
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
    <SectionWithTitle title="????????? ??????">
      {!isLoading && (
        <RadioGroup onChange={(value) => handleRadio(value)} value={addressType}>
          <Stack direction={{ base: 'column', sm: 'row' }} alignItems="flex-start">
            {profile && (
              <>
                <Button onClick={addressListOnOpen} size="sm" variant="outline">
                  ????????? ???????????? ??????
                </Button>
                <Radio value="default">???????????????</Radio>
              </>
            )}
            <Radio value="manual">????????????</Radio>
          </Stack>
        </RadioGroup>
      )}
      {!isLoading && (
        <Stack mt={4}>
          {/* ????????? */}
          <FormControl isInvalid={!!errors.recipientName}>
            <Box>
              <Flex>
                <FormLabel fontWeight="semibold">?????????</FormLabel>
                <Button size="xs" onClick={() => handleRecipientInfo()}>
                  ???????????? ??????
                </Button>
              </Flex>
              <Input
                w="100%"
                maxW={270}
                placeholder="?????????"
                {...register('recipientName', {
                  required: {
                    value: true,
                    message: '??????????????? ????????? ??????????????????(2?????? ??????)',
                  },
                  minLength: 2,
                })}
                mr={1}
              />
              <FormErrorMessage mt={0}>
                {errors.recipientName && errors.recipientName.message}
              </FormErrorMessage>
            </Box>
          </FormControl>

          {/* ????????? */}
          <Flex direction="column">
            <FormControl
              isInvalid={
                !!errors.recipientPhone1 ||
                !!errors.recipientPhone2 ||
                !!errors.recipientPhone3
              }
            >
              <FormLabel fontWeight="semibold">?????????</FormLabel>
              <HStack>
                <Input
                  w={{ base: '100%', md: '15%' }}
                  type="number"
                  maxLength={3}
                  {...register('recipientPhone1', {
                    required: {
                      value: true,
                      message: '??????????????? ???????????? ??????????????????.',
                    },
                    minLength: 2,
                    maxLength: 3,
                  })}
                />
                <Text>-</Text>
                <Input
                  w={{ base: '100%', md: '15%' }}
                  type="number"
                  maxLength={4}
                  {...register('recipientPhone2', {
                    required: {
                      value: true,
                      message: '??????????????? ???????????? ??????????????????.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
                <Text>-</Text>
                <Input
                  w={{ base: '100%', md: '15%' }}
                  type="number"
                  maxLength={4}
                  {...register('recipientPhone3', {
                    required: {
                      value: true,
                      message: '??????????????? ???????????? ??????????????????.',
                    },
                    minLength: 3,
                    maxLength: 4,
                  })}
                />
              </HStack>
              <FormErrorMessage mt={0}>
                ???????????? ????????? ???????????? ??????????????????.
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
              <FormLabel fontWeight="semibold">???????????????</FormLabel>
              <Flex direction="column" mb={2} w={{ base: '100%', md: '50%' }}>
                <HStack>
                  <Input
                    isReadOnly
                    placeholder="????????????"
                    {...register('recipientPostalCode', {
                      required: { value: true, message: '??????????????? ??????????????????' },
                    })}
                  />
                  <Button size="sm" onClick={addressOnOpen}>
                    ????????????
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
                    placeholder="????????????"
                    {...register('recipientAddress', {
                      required: { value: true, message: '????????? ??????????????????' },
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.recipientAddress && errors.recipientAddress.message}
                  </FormErrorMessage>
                </Flex>
                <Flex direction="column">
                  <Input
                    w={{ base: '100%', md: '50%' }}
                    placeholder="????????????"
                    {...register('recipientDetailAddress', {
                      required: { value: true, message: '??????????????? ??????????????????' },
                      maxLength: {
                        value: 30,
                        message: '30??? ?????? ????????? ??? ????????????.',
                      },
                    })}
                  />
                  <FormErrorMessage mt={0}>
                    {errors.recipientDetailAddress?.message}
                  </FormErrorMessage>
                </Flex>
              </Flex>
            </Flex>
          </FormControl>

          <FormControl isInvalid={!!errors.memo}>
            <FormLabel fontWeight="semibold">????????????</FormLabel>
            <Input
              w={{ base: '100%', md: '50%' }}
              placeholder="??? ??? / ?????? ?????? ?????? ??? ??? ??? / ????????? / ?????????"
              {...register('memo', {
                maxLength: {
                  value: 30,
                  message: '30??? ?????? ????????? ??? ????????????.',
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

  // ?????????????????????
  if (data.giftFlag) {
    // ???????????? ????????? ?????? ??????
    const supportOrderItem = data.orderItems.find((item) => !!item.support);
    const support = supportOrderItem?.support;
    if (support) {
      return (
        <Stack>
          <Text fontWeight="bold">???????????? ?????? ????</Text>
          <Stack direction="row" alignItems="center">
            {support.broadcaster.avatar && (
              <Avatar src={support.broadcaster.avatar} mr={2} />
            )}
            <Text fontWeight="bold">{support.broadcaster.userNickname}</Text>
            <Text>?????? ???????????????</Text>
          </Stack>
        </Stack>
      );
    }
  }
  return (
    <>
      <Flex direction="column" mt={3}>
        <Text fontWeight="bold">?????????</Text>
        <Text>{data.recipientName}</Text>
      </Flex>
      <Flex direction="column" mt={3}>
        <Text fontWeight="bold">?????????</Text>
        <HStack>
          <Text>{`${data.recipientPhone}`}</Text>
        </HStack>
      </Flex>
      <Flex direction="column" alignItems="flex-start" mt={3}>
        <Text fontWeight="bold">???????????????</Text>
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
