import CenterBox from '@project-lc/components-layout/CenterBox';
import { Stack, Text, Button, Input, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { GetNonMemberOrderDetailDto } from '@project-lc/shared-types';
import { useNonmemberOrderDetail } from '@project-lc/hooks';
import { useEffect, useState } from 'react';
import NonMemberOrderDetailDisplay from './NonMemberOrderDetailDisplay';

export function NonMemberOrderFindForm(): JSX.Element {
  const router = useRouter();
  const toast = useToast();

  const { register, handleSubmit } = useForm<GetNonMemberOrderDetailDto>({
    defaultValues: {
      orderCode: '',
      ordererName: '',
    },
  });

  const [dto, setDto] = useState<GetNonMemberOrderDetailDto>({
    orderCode: '',
    ordererName: '',
  });

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
            ? '주문번호 혹은 주문자명이 잘못 입력되었거나 조회할 수 없는 주문입니다.'
            : error?.message,
        status: 'error',
      });
    }
  }, [error?.message, error?.response?.status, isError, toast]);

  // * 주문데이터 조회 성공한 경우 주문데이터를 화면에 표시한다
  if (orderData) {
    return <NonMemberOrderDetailDisplay orderData={orderData} />;
  }

  return (
    <CenterBox
      enableShadow
      header={{
        title: '비회원 주문조회',
        desc: '주문번호가 기억나지 않는 경우 고객센터로 문의해주세요',
      }}
    >
      <Stack as="form" py={4} onSubmit={handleSubmit(submitHandler)}>
        <Text>주문번호</Text>
        <Input {...register('orderCode', { required: true })} />
        <Text>주문자명</Text>
        <Input
          {...register('ordererName', {
            required: true,
          })}
        />
        <Stack direction="row" justify="space-around">
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
