import {
  Box,
  Divider,
  Heading,
  HStack,
  Input,
  Text,
  FormErrorMessage,
  Flex,
  FormControl,
} from '@chakra-ui/react';
import { useCustomerInfo, useProfile } from '@project-lc/hooks';
import { PaymentPageDto } from '@project-lc/shared-types';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function BuyerInfo(): JSX.Element {
  const { data: profile } = useProfile();

  const { data } = useCustomerInfo(profile?.id);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<PaymentPageDto>();

  useEffect(() => {
    if (profile && data) {
      setValue('name', profile.name!);
      setValue('email', profile.email);
      setValue('orderPhone', data?.phone);
      setValue('orderPhone1', data?.phone.split('-')[0]);
      setValue('orderPhone2', data?.phone.split('-')[1]);
      setValue('orderPhone3', data?.phone.split('-')[2]);
    }
  }, [profile, data, setValue]);

  return (
    <Box>
      <Heading size="lg">구매자정보</Heading>
      <Divider m={2} />
      {data ? (
        <>
          <HStack>
            <Text fontWeight="bold">이름</Text>
            <Text>{profile?.name}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">이메일</Text>
            <Text>{profile?.email}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold">휴대전화번호</Text>
            <Text>{data?.phone}</Text>
          </HStack>
        </>
      ) : (
        <>
          <FormControl isInvalid={!!errors.name}>
            <Flex direction="column">
              <Text fontWeight="bold">이름</Text>
              <Input
                w={{ base: '100%', md: '25%' }}
                placeholder="주문자명"
                {...register('name', {
                  required: {
                    value: true,
                    message: '주문자의 이름을 입력해주세요(2글자 이상)',
                  },
                  minLength: 2,
                })}
              />
              <FormErrorMessage mt={0}>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </Flex>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <Flex direction="column">
              <Text fontWeight="bold">이메일</Text>
              <Input
                w={{ base: '100%', md: '35%' }}
                type="email"
                placeholder="minsu@example.com"
                {...register('email', {
                  required: {
                    value: true,
                    message: '이메일을 작성해주세요',
                  },
                  minLength: 2,
                })}
              />
              <FormErrorMessage mt={0}>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </Flex>
          </FormControl>
          <Flex direction="column">
            <Text fontWeight="bold">휴대전화번호</Text>
            <FormControl
              isInvalid={
                !!errors.orderPhone1 || !!errors.orderPhone2 || !!errors.orderPhone3
              }
            >
              <HStack>
                <Input
                  w={{ base: '20%', md: '15%' }}
                  type="number"
                  maxLength={3}
                  {...register('orderPhone1', {
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
                  {...register('orderPhone2', {
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
                  {...register('orderPhone3', {
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
        </>
      )}
    </Box>
  );
}
