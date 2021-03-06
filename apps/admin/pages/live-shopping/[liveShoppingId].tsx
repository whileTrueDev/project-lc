import { ChevronLeftIcon, EditIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Input,
  Link,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { AdminLiveShoppingUpdateConfirmModal } from '@project-lc/components-admin/AdminLiveShoppingUpdateConfirmModal';
import { AdminOverlayImageUploadDialog } from '@project-lc/components-admin/AdminOverlayImageUploadDialog';
import { AdminPageLayout } from '@project-lc/components-admin/AdminPageLayout';
import { BroadcasterAutocomplete } from '@project-lc/components-admin/BroadcasterAutocomplete';
import { LiveShoppingDatePicker } from '@project-lc/components-admin/LiveShoppingDatePicker';
import { LiveShoppingDetailTitle } from '@project-lc/components-admin/LiveShoppingDetailTitle';
import { LiveShoppingProgressSelector } from '@project-lc/components-admin/LiveShoppingProgressSelector';
import { SectionWithTitle } from '@project-lc/components-layout/SectionWithTitle';
import { GoodsDetailCommonInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailCommonInfo';
import { GoodsDetailImagesInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailImagesInfo';
import { GoodsDetailInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailInfo';
import { GoodsDetailOptionsInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailOptionsInfo';
import { GoodsDetailPurchaseLimitInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailPurchaseLimitInfo';
import { GoodsDetailShippingInfo } from '@project-lc/components-seller/goods-detail/GoodsDetailShippingInfo';
import { GoodsDetailSummary } from '@project-lc/components-seller/goods-detail/GoodsDetailSummary';
import { AdminLiveShoppingBroadcasterName } from '@project-lc/components-admin/AdminLiveShoppingBroadcasterName';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import {
  LiveShoppingManage,
  useAdminGoodsById,
  useAdminLiveShoppingList,
  useProfile,
  useUpdateLiveShoppingManageMutation,
} from '@project-lc/hooks';
import { LiveShoppingUpdateDTO, LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

function getDuration(startDate: Date, endDate: Date): string {
  if (startDate && startDate) {
    const startTime = dayjs(startDate);
    const endTime = dayjs(endDate);
    const duration = endTime.diff(startTime);
    const hours = duration / (1000 * 60 * 60);
    const stringfiedHours = hours.toFixed(1);
    return `${stringfiedHours}??????`;
  }
  return '??????';
}

export type LiveShoppingFormData = Omit<LiveShoppingUpdateDTO, 'id'>;
export function LiveShoppingDetail(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = router.query.liveShoppingId as string;
  const { data: profileData } = useProfile();
  const {
    data: liveShopping,
    isLoading: liveShoppingIsLoading,
    refetch,
  } = useAdminLiveShoppingList(
    { id: Number(liveShoppingId) },
    { enabled: !!profileData?.id },
  );

  const goodsId = liveShopping ? liveShopping[0].goodsId : '';
  const goods = useAdminGoodsById(goodsId);

  const { mutateAsync } = useUpdateLiveShoppingManageMutation();
  const methods = useForm<LiveShoppingFormData>({
    defaultValues: {
      progress: undefined,
      liveShoppingName: '',
      broadcasterId: undefined,
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      whiletrueCommissionRate: undefined,
      broadcasterCommissionRate: undefined,
    },
  });
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const {
    isOpen: imageDialogIsOpen,
    onOpen: imageDialogOnOpen,
    onClose: imageDialogOnClose,
  } = useDisclosure();
  const onClose = (): void => {
    setIsOpen(false);
  };

  const openConfirmModal = (): void => {
    setIsOpen(true);
  };

  const onSuccess = (): void => {
    reset({
      progress: undefined,
      liveShoppingName: '',
      broadcasterId: undefined,
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      whiletrueCommissionRate: undefined,
      broadcasterCommissionRate: undefined,
    });
    toast({ title: '?????? ??????', status: 'success' });
    refetch();
  };

  const onFail = (err?: AxiosError): void => {
    toast({
      title: '?????? ??????',
      description: err.response.status === 400 ? err?.response?.data?.message : undefined,
      status: 'error',
    });
  };

  const { handleSubmit, register, watch, reset } = methods;
  const onSubmit = async (data: LiveShoppingFormData): Promise<void> => {
    const videoUrlExist = Boolean(liveShopping[0]?.liveShoppingVideo?.youtubeUrl);
    const { sellerId, goodsId: _, contactId, requests, ...restData } = data; // formData???????????? LiveShoppingManage ???????????? ????????? ??????
    const dto: LiveShoppingManage = Object.assign(restData, {
      id: Number(liveShoppingId),
    });
    mutateAsync({ dto, videoUrlExist }).then(onSuccess).catch(onFail);
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
              onClick={() => router.push('/live-shopping')}
            >
              ????????????
            </Button>
          </Flex>
        </Box>
        {/* ?????? ?????? */}
        {liveShopping && !liveShoppingIsLoading && (
          <LiveShoppingDetailTitle
            liveShoppingName={liveShopping[0].liveShoppingName}
            createDate={liveShopping[0].createDate}
          />
        )}
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="start" gap={4}>
          <Stack spacing={5}>
            <Stack direction="row">
              <Text as="span">????????? :</Text>
              <Text color="blue">
                {liveShopping[0].broadcaster
                  ? `${liveShopping[0].goods.goods_name} + ${liveShopping[0].broadcaster.userNickname}`
                  : `${liveShopping[0].goods.goods_name}`}
              </Text>
            </Stack>
            <Stack direction="row">
              <Text as="span">????????? :</Text>
              <Text color="blue">
                {liveShopping[0].seller.sellerShop?.shopName || ''}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">?????? ????????????</Text>
              <LiveShoppingProgressBadge
                progress={liveShopping[0].progress}
                broadcastStartDate={liveShopping[0].broadcastStartDate}
                broadcastEndDate={liveShopping[0].broadcastEndDate}
                sellEndDate={liveShopping[0].sellEndDate}
              />
              {liveShopping[0].progress === LIVE_SHOPPING_PROGRESS.????????? ? (
                <Text>?????? : {liveShopping[0].rejectionReason}</Text>
              ) : null}
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">?????????: </Text>
              {liveShopping[0].broadcaster ? (
                <AdminLiveShoppingBroadcasterName
                  data={liveShopping[0].broadcaster}
                  color="blue"
                />
              ) : (
                <Text fontWeight="bold">??????</Text>
              )}
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text as="span">???????????? ??????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcastStartDate
                  ? dayjs(liveShopping[0].broadcastStartDate).format('YYYY/MM/DD HH:mm')
                  : '??????'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">???????????? ??????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcastEndDate
                  ? dayjs(liveShopping[0].broadcastEndDate).format('YYYY/MM/DD HH:mm')
                  : '??????'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">????????????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {getDuration(
                  liveShopping[0].broadcastStartDate,
                  liveShopping[0].broadcastEndDate,
                )}
              </Text>
            </Stack>
            {liveShopping[0].progress === 'confirmed' &&
              liveShopping[0].liveShoppingVideo && (
                <Stack direction="row" alignItems="center">
                  <Text as="span">?????? URL: </Text>
                  <Text as="span" fontWeight="bold" color="blue">
                    <Link
                      isTruncated
                      href={liveShopping[0].liveShoppingVideo.youtubeUrl || ''}
                      fontWeight="bold"
                      colorScheme="blue"
                      textDecoration="underline"
                      isExternal
                    >
                      {liveShopping[0].liveShoppingVideo.youtubeUrl || ''}
                    </Link>
                  </Text>
                </Stack>
              )}

            <Divider />

            <Stack direction="row" alignItems="center">
              <Text as="span">???????????? ??????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].sellStartDate
                  ? dayjs(liveShopping[0].sellStartDate).format('YYYY/MM/DD HH:mm')
                  : '??????'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">???????????? ??????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].sellEndDate
                  ? dayjs(liveShopping[0].sellEndDate).format('YYYY/MM/DD HH:mm')
                  : '??????'}
              </Text>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text as="span">????????????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {getDuration(liveShopping[0].sellStartDate, liveShopping[0].sellEndDate)}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">?????? ?????? ?????????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].desiredCommission} %
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">?????? ?????? ??????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].desiredPeriod}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">????????? ?????????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcasterCommissionRate
                  ? `${liveShopping[0].broadcasterCommissionRate}%`
                  : '??????'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">???????????? ?????????: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].whiletrueCommissionRate
                  ? `${liveShopping[0].whiletrueCommissionRate}%`
                  : '??????'}
              </Text>
            </Stack>

            <Box>
              <Text>????????????</Text>
              <Textarea
                resize="none"
                rows={10}
                value={liveShopping[0].requests || ''}
                readOnly
              />
            </Box>
          </Stack>

          {/* ??????????????? ?????? ?????? ??? */}
          <FormProvider {...methods}>
            <Stack as="form" spacing={5}>
              <LiveShoppingProgressSelector />
              <Divider />
              <Stack>
                <Text>????????? ?????? ??????</Text>
                <Input {...register('liveShoppingName')} />
              </Stack>
              <BroadcasterAutocomplete />
              <Divider />

              <LiveShoppingDatePicker
                title="?????? ????????????"
                registerName="broadcastStartDate"
              />
              <LiveShoppingDatePicker
                title="?????? ????????????"
                registerName="broadcastEndDate"
              />
              {dayjs(watch('broadcastStartDate')) > dayjs(watch('broadcastEndDate')) && (
                <Text as="em" color="tomato">
                  ?????? ??????????????? ?????????????????? ????????????
                </Text>
              )}
              <Divider />

              <LiveShoppingDatePicker
                title="?????? ????????????"
                registerName="sellStartDate"
              />
              <LiveShoppingDatePicker
                title="?????? ????????????"
                registerName="sellEndDate"
                min={watch('sellStartDate')}
              />
              {dayjs(watch('sellStartDate')) > dayjs(watch('sellEndDate')) && (
                <Text as="em" color="tomato">
                  ?????? ??????????????? ?????????????????? ????????????
                </Text>
              )}
              <Divider />

              <Stack>
                <Text>
                  ?????? URL (https://youtu.be/4pIuCJTMXQU ??? ?????? ????????? ??????????????????)
                </Text>
                <Input
                  placeholder="https://youtu.be/4pIuCJTMXQU"
                  {...register('videoUrl')}
                />
              </Stack>
              <Divider />

              <Button onClick={openConfirmModal} colorScheme="blue">
                ??????
              </Button>
              <Button
                rightIcon={<EditIcon />}
                onClick={imageDialogOnOpen}
                isDisabled={!liveShopping[0].broadcaster}
              >
                ???????????? ????????? ??????
              </Button>
            </Stack>

            <AdminLiveShoppingUpdateConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={handleSubmit(onSubmit)}
            />
            {liveShopping[0].broadcaster && (
              <AdminOverlayImageUploadDialog
                isOpen={imageDialogIsOpen}
                onClose={imageDialogOnClose}
                broadcasterEmail={liveShopping[0].broadcaster.email}
                liveShoppingId={liveShopping[0].id}
              />
            )}
          </FormProvider>
        </Grid>

        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                ?????? ?????? ??????
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel pb={4}>
              {/* ?????? ?????? */}
              <Box as="section">
                <GoodsDetailSummary goods={goods.data} />
              </Box>

              {/* ?????? ?????? */}

              <SectionWithTitle title="?????? ??????">
                <GoodsDetailInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="???????????? ??? ??????">
                <GoodsDetailImagesInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="??????">
                <GoodsDetailOptionsInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="?????? ?????? ??????">
                <GoodsDetailCommonInfo goods={goods.data} />
              </SectionWithTitle>

              <SectionWithTitle title="?????? ??????">
                <GoodsDetailPurchaseLimitInfo goods={goods.data} />
              </SectionWithTitle>

              {goods.data.ShippingGroup && (
                <SectionWithTitle title="????????????">
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

export default LiveShoppingDetail;
