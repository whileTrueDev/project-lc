import {
  Box,
  Button,
  Divider,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { LiveShoppingExternalGoods } from '@prisma/client';
import { ChakraAutoComplete } from '@project-lc/components-core/ChakraAutoComplete';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import {
  useAdminLiveShoppingList,
  useCreateSettlementBcWithExternalItem,
} from '@project-lc/hooks';
import {
  CreateBcSettleHistoryWithExternalItemDto,
  getLiveShoppingProgress,
  LiveShoppingWithGoods,
} from '@project-lc/shared-types';
import { settlementHistoryStore } from '@project-lc/stores';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useMemo } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { calcSettleAmount } from './BcSettlementTargetList';

type ExternalGoodsLiveBcSettlementFormData = {
  liveShoppingId?: number;
  broadcasterCommissionRate?: number;
  settlementAmount?: number;
  totalSalesAmount?: number;
  externalGoods?: LiveShoppingExternalGoods;
  broadcaster?: LiveShoppingWithGoods['broadcaster'];
};

export function ExternalLiveShoppingBcSettlement(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const methods = useForm<ExternalGoodsLiveBcSettlementFormData>({
    defaultValues: {
      settlementAmount: 0,
      totalSalesAmount: 0,
    },
  });
  const roundStore = settlementHistoryStore();

  const { mutateAsync } = useCreateSettlementBcWithExternalItem();
  const onConfirm = async (): Promise<void> => {
    const round = roundStore.selectedRound; // 'YYYY년MM월/1회차'
    if (!round) {
      throw new Error('회차를 설정해 주세요.');
    }

    const formData = methods.getValues();
    if (!formData.liveShoppingId || !formData.broadcaster) {
      throw new Error('정산할 라이브쇼핑을 선택해주세요');
    }
    if (!formData.totalSalesAmount || formData.totalSalesAmount <= 0) {
      throw new Error('총 판매액을 입력해주세요. 0보다 큰 값이어야 합니다');
    }

    const settlementAmount = calcSettleAmount(
      formData.totalSalesAmount,
      formData.broadcasterCommissionRate || 0,
    );

    const dto: CreateBcSettleHistoryWithExternalItemDto = {
      round,
      liveShoppingId: formData.liveShoppingId,
      broadcasterId: formData.broadcaster.id,
      amount: settlementAmount,
    };

    mutateAsync(dto).then(() => {
      resetFormData();
      toast({ title: '정산내역 생성 성공', status: 'success' });
    });
  };

  const onFail = async (e: any): Promise<void> => {
    toast({ title: e.message, status: 'warning' });
  };

  const resetFormData = (): void => {
    methods.setValue('liveShoppingId', undefined);
    methods.setValue('broadcasterCommissionRate', undefined);
    methods.setValue('externalGoods', undefined);
    methods.setValue('broadcaster', undefined);
    methods.setValue('totalSalesAmount', undefined);
  };

  const handleClose = (): void => {
    resetFormData();
    onClose();
  };

  return (
    <Stack>
      <Box>
        <Button onClick={onOpen}>외부상품 라이브쇼핑 정산내역 생성하기</Button>
        <Text color="grayText">
          판매자의 네이버스토어 등에서 진행한 라이브쇼핑의 경우 아래 정산 대상 목록에
          표시되지 않습니다
        </Text>
        <Text color="grayText">
          외부판매처에서 진행한 라이브쇼핑건에 대한 정산내역을 방송인이 볼 수 있도록
          하려면 <br />
          외부상품 라이브쇼핑 정산내역 생성하기 버튼을 사용합니다
        </Text>
      </Box>

      <FormProvider {...methods}>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={handleClose}
          title="외부상품 라이브쇼핑 방송인 정산내역 생성"
          onConfirm={onConfirm}
          onFail={onFail}
        >
          <ExternalLiveShoppingBcSettlementForm />
        </ConfirmDialog>
      </FormProvider>
    </Stack>
  );
}

export default ExternalLiveShoppingBcSettlement;

function ExternalLiveShoppingBcSettlementForm(): JSX.Element {
  const roundStore = settlementHistoryStore();
  const { data: adminLiveShoppingList } = useAdminLiveShoppingList({});
  const { setValue, register, watch, getValues } =
    useFormContext<ExternalGoodsLiveBcSettlementFormData>();

  // 외부상품 진행 & 판매종료상태 & 방송인에 대한 정산내역 없는 라이브쇼핑 목록
  const externalGoodsLiveShoppings = useMemo(() => {
    if (!adminLiveShoppingList) return [];

    return adminLiveShoppingList.filter((ls) => {
      const withExternalGoods = !!ls.externalGoods;
      const statusDone = getLiveShoppingProgress(ls) === '판매종료';
      const noBcSettlement =
        !ls.BroadcasterSettlementItems || ls.BroadcasterSettlementItems.length === 0;

      return withExternalGoods && statusDone && noBcSettlement;
    });
  }, [adminLiveShoppingList]);

  register('liveShoppingId', { required: true });
  register('broadcasterCommissionRate', { required: true });
  register('externalGoods', { required: true });
  register('broadcaster', { required: true });
  register('totalSalesAmount', {
    required: true,
    validate: (amount) => !!amount && amount > 0,
  });
  return (
    <Stack spacing={4}>
      {/* 회차선택 */}
      <Stack>
        <Text fontWeight="bold">회차 선택</Text>
        <RadioGroup
          value={roundStore.selectedRound}
          onChange={(newV) => {
            if (!newV) roundStore.resetRoundSelect();
            roundStore.handleRoundSelect(newV);
          }}
        >
          <Stack mt={4} direction="row" justifyContent="center">
            <Radio value="1">1회차</Radio>
            <Radio value="2">2회차</Radio>
          </Stack>
        </RadioGroup>
      </Stack>
      {/* 라이브쇼핑 선택(외부상품으로 진행한) */}
      <Stack>
        <Text fontWeight="bold">라이브쇼핑 선택</Text>
        <ChakraAutoComplete
          width="100%"
          options={externalGoodsLiveShoppings}
          getOptionLabel={(option) => {
            if (!option) return '';
            const liveShoppingId = option.id;
            const liveShoppingName = option?.liveShoppingName || '방송명 미정';
            const externalGoodsName = option?.externalGoods?.name || '상품 미정';
            const broadcasterId = option?.broadcaster.id || '방송인 미정';
            const broadcasterNickname =
              option?.broadcaster?.userNickname || '활동명 없음';

            return `${liveShoppingName}( id: ${liveShoppingId} ) / 판매상품: ${externalGoodsName} / 방송인 : ${broadcasterNickname}( id: ${broadcasterId} ) `;
          }}
          onChange={(newV) => {
            if (newV) {
              setValue('liveShoppingId', newV.id);
              setValue(
                'broadcasterCommissionRate',
                Number(newV?.broadcasterCommissionRate),
              );
              setValue('externalGoods', newV?.externalGoods || undefined);
              setValue('broadcaster', newV?.broadcaster);
            } else {
              setValue('liveShoppingId', undefined);
              setValue('broadcasterCommissionRate', undefined);
              setValue('externalGoods', undefined);
              setValue('broadcaster', undefined);
            }
          }}
        />
      </Stack>
      {watch('liveShoppingId') && (
        <Stack>
          <Text>
            - 판매상품 :
            <Link isExternal href={getValues('externalGoods')?.linkUrl}>
              <Text color="blue.500" as="span">
                {getValues('externalGoods')?.name}
              </Text>
            </Link>
          </Text>
          <Text>
            - 정산 대상 방송인 :
            <Text color="red.400" as="span" fontWeight="bold">
              {getValues('broadcaster')?.userNickname}
            </Text>
          </Text>
          <Text>
            - 방송인 수수료율 :
            <Text color="red.400" as="span" fontWeight="bold">
              {getValues('broadcasterCommissionRate')} %
            </Text>
          </Text>
        </Stack>
      )}

      {watch('liveShoppingId') && (
        <Stack>
          <Stack direction="row">
            <Text fontWeight="bold">총 판매액</Text>
            <Text as="span" color="GrayText" ml={2}>
              * 외부 판매 창구에서 확인한 총 판매액을 입력해주세요
            </Text>
          </Stack>

          <Stack direction="row">
            <Input
              width="auto"
              type="number"
              {...register('totalSalesAmount', { valueAsNumber: true, required: true })}
            />
            <Text>{getLocaleNumber(watch('totalSalesAmount'))} 원</Text>
          </Stack>

          <Divider />

          <Stack direction="row">
            <Text fontWeight="bold">총 정산액</Text>
            <Text as="span" color="GrayText" ml={2}>
              * 총 판매액 x 방송인 수수료율
            </Text>
          </Stack>

          <Text fontWeight="bold" fontSize="lg">
            {calcSettleAmount(
              watch('totalSalesAmount') || 0,
              watch('broadcasterCommissionRate') || 0,
            ).toLocaleString()}
            원
          </Text>
        </Stack>
      )}
    </Stack>
  );
}
