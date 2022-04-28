import {
  Box,
  Heading,
  VStack,
  Flex,
  HStack,
  Text,
  Grid,
  Divider,
  Button,
  useDisclosure,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Checkbox,
  CheckboxGroup,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useDefaultCustomerAddress, useProfile } from '@project-lc/hooks';
import { useForm, FormProvider } from 'react-hook-form';
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
  const [headPhoneNumber, setHeadPhoneNumber] = useState('');
  const [bodyPhoneNumber, setBodyPhoneNumber] = useState('');
  const [tailPhoneNumber, setTailPhoneNumber] = useState('');
  const { data: profile } = useProfile();
  const { data: defaultAddress, isLoading } = useDefaultCustomerAddress(
    profile?.id || undefined,
  );

  const methods = useForm({
    defaultValues: {
      recipient: '',
      phone: '',
      postalCode: '',
      address: '',
      detailAddress: '',
    },
  });

  const { register, reset, getValues, setValue, watch } = methods;

  function handleRadio(value: string): void {
    setChecked(value);
    if (value === 'manual') {
      reset();
    }
  }

  useEffect(() => {
    if (!isLoading && defaultAddress) {
      setChecked('default');
    }
  }, []);

  return (
    <FormProvider {...methods}>
      <Box>
        <HStack>
          <Heading>배송정보</Heading>
          <Button onClick={addressListOnOpen} size="sm">
            배송지 목록
          </Button>
        </HStack>
        <Divider m={2} />
        {!isLoading && (
          <RadioGroup onChange={(value) => handleRadio(value)} value={checked}>
            <Stack direction="row">
              <Radio value="default">기본배송지</Radio>
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
                  {`${defaultAddress?.phone?.slice(
                    0,
                    3,
                  )} - ${defaultAddress?.phone?.slice(
                    3,
                    7,
                  )} - ${defaultAddress?.phone?.slice(7, 11)}`}
                </Text>
              </HStack>
            </Flex>
            <Flex direction="column" alignItems="flex-start" mt={3}>
              <Text fontWeight="bold">배송지주소</Text>
              <VStack>
                <Text>
                  {`(${defaultAddress?.postalCode}) ${defaultAddress?.address}`}{' '}
                  {`${defaultAddress?.detailAddress}`}
                </Text>
              </VStack>
            </Flex>
          </>
        ) : (
          <>
            <Flex direction="column">
              <Text fontWeight="bold">수령인</Text>
              <Input
                w="sm"
                placeholder="수령인"
                value={watch('recipient')}
                onChange={(e) => {
                  setValue('recipient', e.target.value);
                }}
              />
            </Flex>
            <Flex direction="column">
              <Text fontWeight="bold">연락처</Text>
              <HStack>
                <Input
                  w="15%"
                  value={watch('phone').slice(0, 3)}
                  onChange={(e) => {
                    setHeadPhoneNumber(e.target.value);
                  }}
                />
                <Text>-</Text>
                <Input
                  w="15%"
                  value={watch('phone').slice(3, 7)}
                  onChange={(e) => {
                    setBodyPhoneNumber(e.target.value);
                  }}
                />
                <Text>-</Text>
                <Input
                  w="15%"
                  value={watch('phone').slice(7, 11)}
                  onChange={(e) => {
                    setTailPhoneNumber(e.target.value);
                  }}
                />
              </HStack>
            </Flex>
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
                />
              </HStack>
              <VStack>
                <Input
                  isReadOnly
                  placeholder="기본주소"
                  w="md"
                  value={getValues('address')}
                />
                <Input
                  placeholder="상세주소"
                  w="md"
                  value={watch('detailAddress')}
                  onChange={(e) => {
                    setValue('detailAddress', e.target.value);
                  }}
                />
              </VStack>
            </Flex>
          </>
        )}
        <DeliveryAddressDialog isOpen={addressIsOpen} onClose={addressOnClose} />
        <DeliveryAddressList isOpen={addressListIsOpen} onClose={addressListOnClose} />
      </Box>
    </FormProvider>
  );
}
