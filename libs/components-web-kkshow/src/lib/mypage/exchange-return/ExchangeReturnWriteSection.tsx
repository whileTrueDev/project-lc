import { Button, Divider, Stack, Text, useToast } from '@chakra-ui/react';
import { Preview } from '@project-lc/components-core/ImageInputDialog';
import {
  useCustomerExchangeMutation,
  useCustomerReturnMutation,
  useOrderDetail,
} from '@project-lc/hooks';
import {
  CreateExchangeDto,
  CreateReturnDto,
  exchangeReturnAbleSteps,
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
} & Record<string, any>;
export interface ExchangeReturnWriteFormProps {
  orderId?: number;
}
export function ExchangeReturnWriteSection({
  orderId,
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

  const { data, isLoading, isError } = useOrderDetail(orderId);

  const exchangeRequest = useCustomerExchangeMutation();
  const returnRequest = useCustomerReturnMutation();

  // 주문의 상태가 재배송/환불이 가능한지 확인
  const isPossibleExchangeOrReturn = useMemo(() => {
    if (!data) return true;
    const { step, purchaseConfirmationDate } = data;
    return exchangeReturnAbleSteps.includes(step) && !purchaseConfirmationDate;
  }, [data]);
  // 주문의 상태가 재배송/환불이 불가능하다면 목록으로 리다이렉트 시킴
  if (!isPossibleExchangeOrReturn) {
    return <ExchangeReturnNotAllowed />;
  }
  if (isLoading) return <Text>loading</Text>;
  if (isError) return <Text>error</Text>;
  if (!data) return <Text>no data</Text>;

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
          router.push('/mypage/order-list');
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
      // 필수값 : returnBank, returnBankAccount
      const { returnBank, returnBankAccount } = rest;
      // * 필수값이 있는지 확인
      if (!returnBank || !returnBankAccount) {
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
        returnBank,
        returnBankAccount,
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
          router.push('/mypage/order-list');
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

  return (
    <Stack p={1} spacing={4}>
      <Text>주문번호 : {data.orderCode}</Text>
      <Divider />

      <ItemSelectSection
        orderItems={data.orderItems}
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

          <SolutionSection />

          <Stack direction="row" justifyContent="space-around">
            <Button
              type="button"
              onClick={() => router.push('/mypage/order-list')}
              flex="1"
            >
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
    router.push('/mypage/order-list');
  }, [router]);

  return <Text>재배송/환불 신청이 불가능한 주문입니다</Text>;
}
