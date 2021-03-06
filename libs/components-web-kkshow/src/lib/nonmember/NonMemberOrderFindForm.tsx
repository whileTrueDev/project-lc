import CenterBox from '@project-lc/components-layout/CenterBox';
import {
  Stack,
  Text,
  Button,
  Input,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { GetNonMemberOrderDetailDto } from '@project-lc/shared-types';
import { useNonmemberOrderDetail } from '@project-lc/hooks';
import { useEffect, useMemo, useState } from 'react';
import NonMemberOrderDetailDisplay from './NonMemberOrderDetailDisplay';

export function NonMemberOrderFindForm(): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GetNonMemberOrderDetailDto>({
    defaultValues: {
      ordererPhone: '',
      ordererName: '',
    },
  });

  const defaultDto: GetNonMemberOrderDetailDto = useMemo(
    () => ({
      ordererPhone: '',
      ordererName: '',
    }),
    [],
  );
  const [dto, setDto] = useState<GetNonMemberOrderDetailDto>(defaultDto);

  const { data: orderData, isLoading, error, isError } = useNonmemberOrderDetail(dto);

  const submitHandler = (data: GetNonMemberOrderDetailDto): void => {
    setDto(data);
  };

  // * 주문데이터 조회 실패, 에러발생한 경우 => 토스트메시지
  useEffect(() => {
    if (isError) {
      toast({
        title: '주문조회 불가',
        description:
          error?.response?.status === 400
            ? '휴대전화 혹은 주문자명이 잘못 입력되었거나 조회할 수 없는 주문입니다.'
            : error?.message,
        status: 'error',
      });
      setDto(defaultDto);
    }
  }, [defaultDto, error?.message, error?.response?.status, isError, toast]);

  // * 주문데이터 조회 성공한 경우 주문데이터를 화면에 표시한다
  if (orderData) {
    return <NonMemberOrderDetailDisplay orderData={orderData} />;
  }

  return (
    <CenterBox
      enableShadow
      header={{
        title: '비회원 주문조회',
        desc: '주문시 입력한 휴대전화번호와 이름으로 비회원 주문을 조회할 수 있습니다. 문제가 발생한 경우 고객센터로 문의해주세요.',
      }}
    >
      <Stack as="form" py={4} onSubmit={handleSubmit(submitHandler)}>
        <FormControl isInvalid={!!errors.ordererPhone}>
          <FormLabel>주문자 휴대전화</FormLabel>
          <Input
            placeholder="010-0000-0000와 같은 형태로 입력해주세요."
            {...register('ordererPhone', { required: '휴대전화를 입력해주세요.' })}
          />
          <FormErrorMessage>{errors.ordererPhone?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.ordererName}>
          <FormLabel>주문자명</FormLabel>
          <Input
            placeholder="주문자 명을 입력해주세요."
            {...register('ordererName', { required: '주문자명을 입력해주세요.' })}
          />
          <FormErrorMessage>{errors.ordererName?.message}</FormErrorMessage>
        </FormControl>

        <Stack direction="row" justify="space-around" pt={2}>
          <Button w="100%" onClick={() => router.back()}>
            취소
          </Button>
          <Button w="100%" colorScheme="blue" type="submit" isLoading={isLoading}>
            조회
          </Button>
        </Stack>
      </Stack>
    </CenterBox>
  );
}

export default NonMemberOrderFindForm;
