import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { OrderStatusBadge } from '@project-lc/components-shared/order/OrderStatusBadge';
import {
  useCreateRefundMutation,
  useCustomerOrderCancelMutation,
  useOrderDetail,
} from '@project-lc/hooks';
import {
  banks,
  convertPaymentMethodToKrString,
  CreateRefundDto,
} from '@project-lc/shared-types';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { OrderItemOptionInfo } from './OrderItemOptionInfo';

type RefundAccountDto = Pick<
  CreateRefundDto,
  'refundAccount' | 'refundAccountHolder' | 'refundBank'
>;

export function OrderCancelDialog({
  isOpen,
  onClose,
  orderId,
}: {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
}): JSX.Element {
  const { data: orderDetailData } = useOrderDetail({ orderId });
  // 가상계좌 결제건으로, 환불계좌입력이 필요한 경우 사용하기 위한 form
  const formMethods = useForm<RefundAccountDto>({ mode: 'onChange' });

  const toast = useToast();
  const orderCancelMutation = useCustomerOrderCancelMutation();
  const createRefundMutation = useCreateRefundMutation();
  // 주문취소 요청
  const purchaseConfirmRequest = async (): Promise<void> => {
    if (!orderDetailData) return;
    // 가상계좌 결제건인지
    const isVirtualAccount = orderDetailData.payment?.method === 'virtualAccount';
    if (isVirtualAccount) {
      const isValid = await formMethods.trigger();
      if (!isValid) throw new Error('Refund account form data is not valid');
    }

    const dto = {
      orderId: orderDetailData.id,
      items: orderDetailData.orderItems.flatMap((item) =>
        item.options.map((opt) => ({
          orderItemId: item.id,
          orderItemOptionId: opt.id,
          amount: opt.quantity,
        })),
      ),
    };

    orderCancelMutation
      .mutateAsync(dto)
      .then(async (res) => {
        // 결제완료 주문인 경우 환불처리 진행
        if (orderDetailData.step === 'paymentConfirmed') {
          const refundAccountInfo = formMethods.getValues();
          const refundDto: CreateRefundDto = {
            orderId: orderDetailData.id,
            reason: '소비자의 주문취소신청',
            items: dto.items,
            orderCancellationId: res.id,
            refundAmount: orderDetailData.paymentPrice,
            paymentKey: orderDetailData.payment?.paymentKey,
            ...refundAccountInfo, // 가상계좌결제의 경우 환불 계좌 정보 추가
            refundBank: banks.find(
              (bank) => bank.bankName === refundAccountInfo.refundBank,
            )?.bankCode,
          };
          await createRefundMutation.mutateAsync(refundDto);
        }
        toast({ title: '주문 취소 완료', status: 'success' });
      })
      .catch((e) => {
        toast({
          title: '주문 취소 중 오류가 발생하였습니다.',
          status: 'error',
          description: e.response?.data?.message || e.message,
        });
      });
  };

  return (
    <ConfirmDialog
      title="주문 취소"
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={purchaseConfirmRequest}
      isLoading={createRefundMutation.isLoading || orderCancelMutation.isLoading}
      isDisabled={
        orderDetailData?.payment?.method === 'virtualAccount' &&
        !formMethods.formState.isValid
      }
    >
      {orderDetailData ? (
        <Stack>
          <Text>이 주문을 취소하시겠습니까?</Text>
          <Box p={2} borderWidth="thin" rounded="md">
            <Flex gap={2}>
              <Text fontWeight="bold">주문번호:</Text>
              <Text>{orderDetailData.orderCode}</Text>
            </Flex>
            <Flex gap={2}>
              <Text fontWeight="bold">주문상태:</Text>
              <OrderStatusBadge step={orderDetailData.step} />
            </Flex>
            {orderDetailData.payment && (
              <Flex gap={2}>
                <Text fontWeight="bold">결제수단:</Text>
                <Text>
                  {convertPaymentMethodToKrString(orderDetailData.payment.method)}
                </Text>
              </Flex>
            )}
            <Text fontWeight="bold">주문상품</Text>
            <Box pl={4}>
              {orderDetailData.orderItems.flatMap((item) =>
                item.options.map((opt) => (
                  <OrderItemOptionInfo
                    key={opt.id}
                    order={orderDetailData}
                    option={opt}
                    orderItem={item}
                    displayStatus={false}
                  />
                )),
              )}
            </Box>
          </Box>

          {orderDetailData.payment?.method === 'virtualAccount' && (
            <FormProvider {...formMethods}>
              <RefundAccountForm />
            </FormProvider>
          )}
        </Stack>
      ) : (
        <Center>
          <Spinner />
        </Center>
      )}
    </ConfirmDialog>
  );
}

function RefundAccountForm(): JSX.Element {
  const {
    register,
    formState: { errors },
  } = useFormContext<RefundAccountDto>();

  return (
    <Stack p={2} borderWidth="thin" rounded="md">
      <Text fontWeight="bold">환불계좌 정보입력 (가상계좌결제건)</Text>
      <Text fontSize="sm">환불계좌정보를 신중히 입력해주세요.</Text>
      <FormControl isInvalid={!!errors.refundBank}>
        <FormLabel fontSize="sm" my={0}>
          은행
        </FormLabel>
        <Select
          id="bank"
          autoComplete="off"
          maxW={200}
          maxLength={10}
          size="sm"
          placeholder="환불은행을 선택하세요."
          {...register('refundBank', {
            required: '은행을 반드시 선택해주세요.',
          })}
        >
          {banks.map(({ bankCode, bankName }) => (
            <option key={bankCode} value={bankName}>
              {bankName}
            </option>
          ))}
        </Select>
        <FormErrorMessage fontSize="xs">{errors.refundBank?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.refundAccount}>
        <FormLabel fontSize="sm" my={0}>
          계좌번호
        </FormLabel>
        <Input
          id="refundAccount"
          size="sm"
          autoComplete="off"
          maxW={200}
          placeholder="계좌번호를 입력하세요.(숫자만)"
          {...register('refundAccount', {
            required: '계좌번호를 반드시 입력해주세요.',
            pattern: {
              value: /^[0-9]+$/,
              message: '계좌번호는 숫자만 가능합니다.',
            },
          })}
        />
        <FormErrorMessage fontSize="xs">{errors.refundAccount?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.refundAccountHolder}>
        <FormLabel fontSize="sm" my={0}>
          예금주
        </FormLabel>
        <Input
          id="refundAccountHolder"
          size="sm"
          placeholder="예금주를 입력하세요."
          autoComplete="off"
          maxW={200}
          {...register('refundAccountHolder', {
            required: '예금주를 반드시 입력해주세요.',
          })}
        />
        <FormErrorMessage fontSize="xs">
          {errors.refundAccountHolder && errors.refundAccountHolder.message}
        </FormErrorMessage>
      </FormControl>
    </Stack>
  );
}
