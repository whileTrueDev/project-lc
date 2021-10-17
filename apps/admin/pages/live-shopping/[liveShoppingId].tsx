import { useState } from 'react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  Stack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Badge,
  Grid,
  useToast,
  Divider,
} from '@chakra-ui/react';
import {
  AdminPageLayout,
  LiveShoppingDetailTitle,
  BroadcasterAutocomplete,
  LiveShoppingProgressSelector,
  LiveShoppingDatePicker,
  GoodsDetailCommonInfo,
  GoodsDetailImagesInfo,
  GoodsDetailInfo,
  GoodsDetailOptionsInfo,
  GoodsDetailPurchaseLimitInfo,
  GoodsDetailShippingInfo,
  GoodsDetailSummary,
  SectionWithTitle,
  BroadcasterName,
  AdminLiveShoppingUpdateConfirmModal,
} from '@project-lc/components';
import {
  useAdminLiveShoppingList,
  useProfile,
  useBroadcaster,
  useAdminGoodsById,
  useUpdateLiveShoppingManageMutation,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import { FaGalacticSenate } from 'react-icons/fa';

function switchStatus(progress: string, startDate?: Date, endDate?: Date): JSX.Element {
  if (startDate && endDate) {
    if (
      new Date(startDate).valueOf() < new Date().valueOf() &&
      new Date(endDate).valueOf() > new Date().valueOf() &&
      progress === 'confirmed'
    ) {
      return <Badge colorScheme="blue">라이브 진행중</Badge>;
    }
    if (new Date(endDate).valueOf() < new Date().valueOf() && progress === 'confirmed') {
      return <Badge colorScheme="telegram">방송종료</Badge>;
    }
  }

  switch (progress) {
    case 'adjust':
      return <Badge colorScheme="purple">조율중</Badge>;
    case 'confirmed':
      return <Badge colorScheme="orange">확정</Badge>;
    case 'cancel':
      return <Badge colorScheme="red">취소</Badge>;
    default:
      return <Badge>등록됨</Badge>;
  }
}

export function GoodsDetail(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = (): void => {
    setIsOpen(false);
  };
  let duration;
  const router = useRouter();
  const liveShoppingId = router.query.liveShoppingId as string;
  const { data: profileData } = useProfile();
  const { data: liveShopping, isLoading: liveShoppingIsLoading } =
    useAdminLiveShoppingList({
      enabled: !!profileData?.email,
      id: liveShoppingId,
    });

  const goodsId = liveShopping ? liveShopping[0].goodsId : '';
  const goods = useAdminGoodsById(goodsId);

  const { data: broadcaster } = useBroadcaster();
  const { mutateAsync } = useUpdateLiveShoppingManageMutation();
  const methods = useForm({
    defaultValues: {
      progress: '',
      broadcaster: '',
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
    },
  });
  const toast = useToast();

  const onSuccess = (): void => {
    toast({
      title: '변경 완료',
      status: 'success',
    });
  };

  const onFail = (): void => {
    toast({
      title: '변경 실패',
      status: 'error',
    });
  };
  console.log(liveShopping);
  const { handleSubmit } = methods;
  const regist = (data: any): void => {
    const dto = Object.assign(data, { liveShoppingId });
    console.log(dto);
    setIsOpen(true);
    // mutateAsync(dto).then(onSuccess).catch(onFail);
  };

  if (liveShoppingIsLoading || goods.isLoading)
    return <AdminPageLayout>...loading</AdminPageLayout>;

  if (!goods.isLoading && !goods.data)
    return <AdminPageLayout>...no data</AdminPageLayout>;

  if (liveShopping[0].broadcastStartDate && liveShopping[0].broadcastEndDate) {
    const startTime = new Date(liveShopping[0].broadcastStartDate);
    const endTime = new Date(liveShopping[0].broadcastEndDate);
    duration = endTime.valueOf() - startTime.valueOf();
    duration = (duration / (1000 * 60 * 60)) % 24;
  }

  return (
    <AdminPageLayout>
      <Stack m="auto" maxW="4xl" mt={{ base: 2, md: 8 }} spacing={8} p={2} mb={16}>
        <Box as="section">
          <Flex direction="row" alignItems="center" justifyContent="space-between">
            <Button
              size="sm"
              leftIcon={<ChevronLeftIcon />}
              onClick={() => router.push('/goods')}
            >
              목록으로
            </Button>
            {/* 상품 검수를 위한 버튼 */}
          </Flex>
        </Box>
        {/* 상품 제목 */}
        {liveShopping && !liveShoppingIsLoading && (
          <LiveShoppingDetailTitle liveShopping={liveShopping[0]} />
        )}
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="start">
          <Stack spacing={5}>
            <Stack direction="row" alignItems="center">
              <Text as="span">진행상태</Text>
              {switchStatus(
                liveShopping[0].progress,
                liveShopping[0].broadcastStartDate,
                liveShopping[0].broadcastEndDate,
              )}
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">방송인: </Text>
              {liveShopping[0].broadcaster ? (
                <BroadcasterName data={liveShopping[0].broadcaster} />
              ) : (
                <Text fontWeight="bold">미정</Text>
              )}
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text as="span">방송시작 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping[0].broadcastStartDate
                  ? dayjs(liveShopping[0].broadcastStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping[0].broadcastEndDate
                  ? dayjs(liveShopping[0].broadcastEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송시간: </Text>
              <Text as="span" fontWeight="bold">
                {duration ? `${duration} 시간` : '미정'}
              </Text>
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">판매시작 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping[0].sellStartDate
                  ? dayjs(liveShopping[0].sellStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">판매종료 시간: </Text>
              <Text as="span" fontWeight="bold">
                {liveShopping[0].sellEndDate
                  ? dayjs(liveShopping[0].sellEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>
          </Stack>
          <FormProvider {...methods}>
            <Stack as="form" spacing={5} onSubmit={handleSubmit(regist)}>
              <LiveShoppingProgressSelector />
              <Divider />
              <BroadcasterAutocomplete data={broadcaster} />
              <Divider />

              <LiveShoppingDatePicker
                title="방송 시작시간"
                registerName="broadcastStartDate"
              />
              <LiveShoppingDatePicker
                title="방송 종료시간"
                registerName="broadcastEndDate"
              />
              <Divider />
              <LiveShoppingDatePicker
                title="판매 시작시간"
                registerName="sellStartDate"
              />
              <LiveShoppingDatePicker title="판매 종료시간" registerName="sellEndDate" />
              <Button type="submit">등록</Button>
            </Stack>
            <AdminLiveShoppingUpdateConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={() => {
                console.log('제출');
                return 'succeed';
                // mutateAsync(dto).then(onSuccess).catch(onFail);
              }}
            />
          </FormProvider>
        </Grid>

        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                상품 정보 보기
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              {/* 상품 요약 */}
              <Box as="section">
                <GoodsDetailSummary goods={goods.data} />
              </Box>

              {/* 상품 정보 */}

              <SectionWithTitle title="기본 정보">
                <GoodsDetailInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="상품사진 및 설명">
                <GoodsDetailImagesInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="옵션">
                <GoodsDetailOptionsInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="상품 공통 정보">
                <GoodsDetailCommonInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="구매 제한">
                <GoodsDetailPurchaseLimitInfo goods={goods.data} />
              </SectionWithTitle>

              {goods.data.ShippingGroup && (
                <SectionWithTitle title="배송정책">
                  <GoodsDetailShippingInfo goods={goods.data} />
                </SectionWithTitle>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
    </AdminPageLayout>
  );
}

export default GoodsDetail;
