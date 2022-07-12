import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
} from '@chakra-ui/react';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { useCustomerInfo, useProfile } from '@project-lc/hooks';
import { CreateOrderForm, emailRegisterOptions } from '@project-lc/shared-types';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export function BuyerInfo(): JSX.Element {
  const { data: profile } = useProfile();
  const { data } = useCustomerInfo(profile?.id);

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<CreateOrderForm>();

  useEffect(() => {
    if (profile && data && data.name) {
      setValue('ordererEmail', profile.email);
      setValue('ordererName', data.name);
    }
    if (profile && data && data.phone) {
      setValue('ordererPhone', data.phone);
      setValue('ordererPhone1', data.phone.split('-')[0]);
      setValue('ordererPhone2', data.phone.split('-')[1]);
      setValue('ordererPhone3', data.phone.split('-')[2]);
    }
  }, [profile, data, setValue]);

  return (
    <SectionWithTitle title="주문자 정보" disableDivider titleMarginY={4}>
      {data ? (
        <Box>
          <HStack>
            <Text as="h6" fontWeight="semibold">
              이름
            </Text>
            <Text>{profile?.name}</Text>
          </HStack>
          <HStack>
            <Text as="h6" fontWeight="semibold">
              이메일
            </Text>
            <Text>{profile?.email}</Text>
          </HStack>
          <HStack>
            <Text as="h6" fontWeight="semibold">
              휴대전화번호
            </Text>
            <Text>{data?.phone}</Text>
          </HStack>
        </Box>
      ) : (
        <Stack>
          <FormControl isInvalid={!!errors.ordererName}>
            <FormLabel fontWeight="semibold">이름</FormLabel>
            <Input
              maxW={250}
              placeholder="주문자명"
              {...register('ordererName', {
                required: '주문자의 이름을 입력해주세요(2글자 이상)',
                minLength: 2,
              })}
            />
            <FormErrorMessage>{errors.ordererName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.ordererEmail}>
            <FormLabel fontWeight="semibold">이메일</FormLabel>
            <Input
              maxW={250}
              type="email"
              placeholder="kkshow@example.com"
              {...register('ordererEmail', { ...emailRegisterOptions })}
            />
            <FormErrorMessage>{errors.ordererEmail?.message}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={
              !!errors.ordererPhone1 || !!errors.ordererPhone2 || !!errors.ordererPhone3
            }
          >
            <FormLabel fontWeight="semibold">휴대전화</FormLabel>
            <HStack>
              <Input
                maxW="80px"
                type="number"
                maxLength={3}
                {...register('ordererPhone1', {
                  required: '휴대전화를 올바르게 입력해주세요.',
                  minLength: 2,
                  maxLength: 3,
                })}
              />
              <Text>-</Text>
              <Input
                maxW="80px"
                type="number"
                maxLength={4}
                {...register('ordererPhone2', {
                  required: '휴대전화를 올바르게 입력해주세요.',
                  minLength: 3,
                  maxLength: 4,
                })}
              />
              <Text>-</Text>
              <Input
                maxW="80px"
                type="number"
                maxLength={4}
                {...register('ordererPhone3', {
                  required: '휴대전화를 올바르게 입력해주세요.',
                  minLength: 3,
                  maxLength: 4,
                })}
              />
            </HStack>
            <FormErrorMessage>휴대전화 번호를 올바르게 입력해주세요.</FormErrorMessage>
          </FormControl>
        </Stack>
      )}
    </SectionWithTitle>
  );
}
