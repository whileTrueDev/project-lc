import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useUpdateReturnMutation } from '@project-lc/hooks';
import {
  AdminReturnData,
  OrderRetusnStatusForm,
  UpdateReturnDto,
} from '@project-lc/shared-types';
import { useForm } from 'react-hook-form';

export function UpdateReturnRequestStatusSection({
  data,
  successHandler,
}: {
  data: AdminReturnData;
  successHandler?: () => void;
}): JSX.Element {
  const { mutateAsync } = useUpdateReturnMutation();
  const toast = useToast();
  const onSuccess = (): void => {
    toast({
      title: `상태를 변경하였습니다`,
      description: `주문자명: ${data.order.ordererName}, 반품요청코드: ${data.returnCode}`,
      status: 'success',
    });
    if (successHandler) successHandler();
  };

  const onFail = (): void => {
    toast({
      title: `상태 변경 중 오류가 발생하였습니다`,
      description: `주문자명: ${data.order.ordererName}, 반품요청코드: ${data.returnCode}`,
      status: 'error',
    });
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<OrderRetusnStatusForm>({
    defaultValues: {
      status: data.status,
      rejectReason: data.rejectReason,
    },
  });

  async function onSubmit(formData: OrderRetusnStatusForm): Promise<void> {
    const { status, rejectReason } = formData;
    const dto: UpdateReturnDto = {
      status,
      // 취소가 아닌 다른상태로 변경하는경우, 거절사유를 빈 문자열로 변경함(거절사유가 남아있을 수 있으므로)
      rejectReason: status !== 'canceled' ? '' : rejectReason || undefined,
      memo: `관리자가 상태를 ${status}로 변경`,
    };

    await mutateAsync({
      returnId: data.id,
      dto,
    })
      .then(onSuccess)
      .catch(onFail);
  }

  return (
    <Stack as="form" onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.status}>
        <Stack direction="row" alignItems="center">
          <FormLabel>환불 요청 상태</FormLabel>
          <Select
            width="400px"
            placeholder="변경할 상태를 선택하세요."
            {...register('status', {
              required: {
                value: true,
                message: `변경할 상태를 선택해주세요.`,
              },
            })}
          >
            <option value="requested">요청됨(초기 상태, 담당자 확인전)</option>
            <option value="processing">요청승인</option>
            <option value="complete">처리완료</option>
            <option value="canceled">취소(거절)</option>
          </Select>
          <Button colorScheme="blue" type="submit">
            요청 상태 변경하기
          </Button>
        </Stack>
        {/* 거절사유 */}
        {watch('status') === 'canceled' && (
          <FormControl isInvalid={!!errors.rejectReason}>
            <FormLabel>요청 거절 사유</FormLabel>
            <Input
              placeholder="소비자의 환불 요청이 거절된 이유"
              {...register('rejectReason')}
            />
            {errors.rejectReason && (
              <FormErrorMessage>{errors.rejectReason.message}</FormErrorMessage>
            )}
          </FormControl>
        )}
        {data.status === 'complete' && (
          <Text color="GrayText">
            * 토스페이먼츠 결제취소처리가 완료된 경우, 상태를 변경해도 토스페이먼츠
            결제취소 처리는 변경되지 않습니다
          </Text>
        )}

        {errors.status && <FormErrorMessage>{errors.status.message}</FormErrorMessage>}
      </FormControl>
    </Stack>
  );
}
