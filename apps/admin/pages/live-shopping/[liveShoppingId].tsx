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
  Grid,
  useToast,
  Divider,
  Input,
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
  LiveShoppingProgressConverter,
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
import { LiveShoppingDTO } from '@project-lc/shared-types';
import dayjs from 'dayjs';

function getDuration(startDate: Date, endDate: Date): string {
  let duration;
  if (startDate && startDate) {
    const startTime = new Date(startDate);
    const endTime = new Date(endDate);
    duration = endTime.valueOf() - startTime.valueOf();
    duration = (duration / (1000 * 60 * 60)) % 24;
    duration = duration.toFixed(1);
    return `${String(duration)}시간`;
  }
  return '미정';
}

export function GoodsDetail(): JSX.Element {
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
      broadcasterId: '',
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
    },
  });
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const onClose = (): void => {
    setIsOpen(false);
  };

  const openConfirmModal = (): void => {
    setIsOpen(true);
  };

  const onSuccess = (): void => {
    toast({
      title: '변경 완료',
      status: 'success',
    });
    router.reload();
  };

  const onFail = (): void => {
    toast({
      title: '변경 실패',
      status: 'error',
    });
  };

  const { handleSubmit, register } = methods;
  const regist = async (
    data: Omit<
      LiveShoppingDTO,
      'streamId' | 'sellerId' | 'goods_id' | 'contactId' | 'requests'
    >,
  ): Promise<void> => {
    const dto = Object.assign(data, { id: liveShoppingId });
    mutateAsync(dto).then(onSuccess).catch(onFail);
  };

  if (liveShoppingIsLoading || goods.isLoading)
    return <AdminPageLayout>...loading</AdminPageLayout>;

  if (!goods.isLoading && !goods.data)
    return <AdminPageLayout>...no data</AdminPageLayout>;

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
          </Flex>
        </Box>
        {/* 상품 제목 */}
        {liveShopping && !liveShoppingIsLoading && (
          <LiveShoppingDetailTitle
            goodsName={liveShopping[0].goods.goods_name}
            createDate={liveShopping[0].createDate}
          />
        )}
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="start">
          <Stack spacing={5}>
            <Text as="span">판매자 : {liveShopping[0].seller.sellerShop.shopName}</Text>

            <Stack direction="row" alignItems="center">
              <Text as="span">진행상태</Text>
              <LiveShoppingProgressConverter
                progress={liveShopping[0].progress}
                broadcastStartDate={liveShopping[0].broadcastStartDate}
                broadcastEndDate={liveShopping[0].broadcastEndDate}
                sellEndDate={liveShopping[0].sellEndDate}
              />
              {liveShopping[0].progress === 'cancel' ? (
                <Text>사유 : {liveShopping[0].rejectionReason}</Text>
              ) : null}
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
                {getDuration(
                  liveShopping[0].broadcastStartDate,
                  liveShopping[0].broadcastEndDate,
                )}
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
            <Stack direction="row" alignItems="center">
              <Text as="span">판매시간: </Text>
              <Text as="span" fontWeight="bold">
                {getDuration(liveShopping[0].sellStartDate, liveShopping[0].sellEndDate)}
              </Text>
            </Stack>
          </Stack>
          <FormProvider {...methods}>
            <Stack as="form" spacing={5}>
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
              <Divider />
              <Stack>
                <Text>영상 URL</Text>
                <Input {...register('videoUrl')} />
              </Stack>
              <Button onClick={openConfirmModal}>등록</Button>
            </Stack>
            <AdminLiveShoppingUpdateConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={handleSubmit(regist)}
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
