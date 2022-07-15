import {
  Button,
  Center,
  Divider,
  Spinner,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Preview } from '@project-lc/components-core/ImageInputDialog';
import {
  useCustomerExchangeMutation,
  useCustomerReturnMutation,
  useOrderDetail,
  usePaymentByOrderCode,
} from '@project-lc/hooks';
import {
  CreateExchangeDto,
  CreateReturnDto,
  exchangeReturnAbleSteps,
  RefundAccountDto,
} from '@project-lc/shared-types';
import { s3 } from '@project-lc/utils-s3';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import ItemSelectSection, { SelectedOrderItem } from './ItemSelectSection';
import PhotoSection from './PhotoSection';
import ReasonSection from './ReasonSection';
import SolutionSection, { Solution } from './SolutionSection';

/** 재배송/환불 요청 관련 이미지 업로드 */
async function uploadImages({
  previews,
  type,
}: {
  previews: { file: File }[];
  type: 'exchange' | 'return';
}): Promise<{ imageUrl: string }[]> {
  let images: { imageUrl: string }[] = [];
  try {
    images = await Promise.all(
      previews.map(async (img) => {
        const { objectUrl } = await s3.sendPutObjectCommand({
          Key: `${type}-request/${new Date().getTime()}_${img.file.name}`,
          Body: img.file,
          ContentType: img.file.type,
          ACL: 'public-read',
        });
        return { imageUrl: objectUrl };
      }),
    );
  } catch (e) {
    console.error('이미지 업로드 오류');
    console.error(e);
  }
  return images;
}

type ExchangeReturnFormData = {
  previews: Preview[];
  solution: Solution;
} & RefundAccountDto &
  Record<string, any>;
export interface ExchangeReturnWriteFormProps {
  orderId?: number;
  /** 재배송/반품요청 클릭한 상품옵션 -> 동일한 판매자의 상품만 표시하기 위해 전달함 */
  optionId?: number;
}
export function ExchangeReturnWriteSection({
  orderId,
  optionId,
}: ExchangeReturnWriteFormProps): JSX.Element {
  const toast = useToast();
  const router = useRouter();

  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]); // dto.items, dto.exchangeItems
  const methods = useForm<ExchangeReturnFormData>({
    defaultValues: {
      previews: [],
      solution: 'exchange',
    },
  });

  const { data, isLoading, isError } = useOrderDetail({ orderId });

  const { data: paymentData } = usePaymentByOrderCode(data?.orderCode || '');

  const exchangeRequest = useCustomerExchangeMutation();
  const returnRequest = useCustomerReturnMutation();

  /** 재배송/환불 요청 가능한 상품 목록
   * 주문에 포함된 상품 중 재배송/환불 클릭한 상품과 동일한 판매자 & 동일배송정책으로 묶여서 주문된 상품만 포함 => 환불,재배송 처리시 판매자별로 승인하고 처리하므로
   * 주문상품옵션의 경우
   *  - 상태가 재배송/환불 신청이 가능한 상태인것만 포함
   *  - 교환요청이 있으나 완료된 경우는 포함
   */
  const selectableItems = useMemo(() => {
    if (!data || !optionId) return [];

    const orderItemIncludesClickedOption = data.orderItems.find((item) =>
      item.options.some((opt) => opt.id === optionId),
    );
    const targetOrderShippingId = orderItemIncludesClickedOption?.orderShippingId;

    // 교환요청이 완료되지 않은 주문상품옵션 id[]
    const unCompletedExchangeItemIds =
      data.exchanges
        ?.flatMap((e) => e.exchangeItems)
        .filter((ei) => ei.status !== 'complete') // 교환 요청 완료되지 않은 상품 (교환요청 완료된 경우, 재배송받은 상품에 대해 다시 교환 요청하는 경우가 존재할 수 있으므로)
        .map((ei) => ei.orderItemOptionId) || [];

    return data.orderItems
      .filter((item) => item.orderShippingId === targetOrderShippingId)
      .map((item) => ({
        ...item,
        options: item.options.filter(
          (opt) =>
            exchangeReturnAbleSteps.includes(opt.step) && // 주문상품옵션 상태가 재배송/환불 신청이 가능한 것만
            !unCompletedExchangeItemIds.includes(opt.id), // 교환요청 완료되지 않은 주문상품 옵션이 아닌 경우에만
        ),
      }));
  }, [data, optionId]);

  const onSubmit: SubmitHandler<ExchangeReturnFormData> = async (formData) => {
    const { solution, reason, previews, ...rest } = formData;
    // * 공통 필수 값 확인  : orderId, reason, items(selectedItems) -------------
    if (!orderId) {
      return;
    }
    if (selectedItems.length === 0) {
      toast({
        title: '재배송/환불 신청할 상품을 선택하지 않았습니다.',
        status: 'warning',
      });
      return;
    }

    // * 교환(재배송)요청인 경우  --------------------------
    if (solution === 'exchange') {
      // 필수값 : recipientAddress,recipientDetailAddress,recipientPostalCode
      const {
        recipientAddress,
        recipientDetailAddress,
        recipientPostalCode,
        recipientShippingMemo,
      } = rest;
      // 선택값 : recipientShippingMemo
      // * 필수값이 있는지 확인
      if (!recipientAddress || !recipientDetailAddress || !recipientPostalCode) {
        toast({
          title: '재배송받을 주소를 입력하지 않았습니다.',
          status: 'warning',
        });
        return;
      }
      // * createExchagneDto 만들기(이미지 s3에 저장)
      const dto: CreateExchangeDto = {
        orderId,
        reason,
        exchangeItems: selectedItems,
        recipientAddress,
        recipientDetailAddress,
        recipientPostalCode,
        recipientShippingMemo,
        images:
          previews.length > 0
            ? await uploadImages({ type: 'exchange', previews })
            : undefined,
      };

      // * 교환 생성 요청
      exchangeRequest
        .mutateAsync(dto)
        .then((res) => {
          console.log(res);
          toast({
            title:
              '재배송 요청이 접수되었습니다. 처리과정 및 결과는 반품/교환 내역에서 확인 가능합니다.',
            status: 'success',
          });
          router.push('/mypage/orders');
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: '재배송 요청 실패',
            status: 'error',
          });
        });
    }

    // * 반품(환불)요청 경우  --------------------------
    if (solution === 'return') {
      // payment.method === 'virtualAccount'인 경우에만 필수값 : refundBank, refundAccount, refundAccountHolder=>
      const { refundBank, refundAccount, refundAccountHolder } = rest;
      // * 필수값이 있는지 확인
      if (
        paymentData &&
        paymentData.method === '가상계좌' &&
        (!refundBank || !refundAccount || !refundAccountHolder)
      ) {
        toast({
          title: '환불받을 계좌정보를 입력하지 않았습니다.',
          status: 'warning',
        });
        return;
      }
      // * createReturnDto 만들기(이미지 s3에 저장)
      const dto: CreateReturnDto = {
        orderId,
        reason,
        items: selectedItems,
        refundBank, // Bank.bankName 형태로 저장
        refundAccount,
        refundAccountHolder,
        images:
          previews.length > 0
            ? await uploadImages({ type: 'return', previews })
            : undefined,
      };

      // * 반품 생성 요청
      returnRequest
        .mutateAsync(dto)
        .then((res) => {
          console.log(res);
          toast({
            title:
              '환불 요청이 접수되었습니다. 처리과정 및 결과는 반품/교환 내역에서 확인 가능합니다.',
            status: 'success',
          });
          router.push('/mypage/orders');
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: '환불 요청 실패',
            status: 'error',
          });
        });
    }
  };

  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );
  if (isError)
    return (
      <Text>
        주문정보 조회 중 오류가 발생하였습니다. 잠시 후 다시 시도해주세요. 문제가 반복되면
        고객센터로 문의 부탁드립니다.
      </Text>
    );
  if (!data) return <ExchangeReturnNotAllowed />;
  return (
    <Stack p={1} spacing={4}>
      <Text>주문번호 : {data.orderCode}</Text>
      <Divider />

      {/* 재배송/환불할 상품 선택하는 부분 => 주문에 포함된 전체 상품을 표시하지 않음. 재배송/환불 신청 버튼 눌렀던 상품과 동일한 판매자&배송비정책인 상품만 표시 */}
      <ItemSelectSection
        order={data}
        orderItems={selectableItems}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
      <Divider />

      <FormProvider {...methods}>
        <Stack as="form" onSubmit={methods.handleSubmit(onSubmit)} spacing={8}>
          <ReasonSection />
          <Divider />

          <PhotoSection description="재배송/환불 요청과 관련된 사진을 등록해주세요" />
          <Divider />

          <SolutionSection paymentMethod={paymentData?.method} />

          <Stack direction="row" justifyContent="space-around">
            <Button type="button" onClick={() => router.push('/mypage/orders')} flex="1">
              취소하기
            </Button>
            <Button type="submit" flex="1" colorScheme="blue">
              신청하기
            </Button>
          </Stack>
        </Stack>
      </FormProvider>
    </Stack>
  );
}

export default ExchangeReturnWriteSection;

function ExchangeReturnNotAllowed(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push('/mypage/orders');
    }, 2000);
    return () => clearTimeout(timeout);
  }, [router]);

  return <Text>재배송/환불 신청이 불가능한 주문입니다</Text>;
}
