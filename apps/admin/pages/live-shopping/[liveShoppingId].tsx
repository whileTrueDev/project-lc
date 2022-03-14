import { ChevronLeftIcon, EditIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
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
import { BroadcasterName } from '@project-lc/components-shared/BroadcasterName';
import { GoodsDetailCommonInfo } from '@project-lc/components-seller/GoodsDetailCommonInfo';
import { GoodsDetailImagesInfo } from '@project-lc/components-seller/GoodsDetailImagesInfo';
import { GoodsDetailInfo } from '@project-lc/components-seller/GoodsDetailInfo';
import { GoodsDetailOptionsInfo } from '@project-lc/components-seller/GoodsDetailOptionsInfo';
import { GoodsDetailPurchaseLimitInfo } from '@project-lc/components-seller/GoodsDetailPurchaseLimitInfo';
import { GoodsDetailShippingInfo } from '@project-lc/components-seller/GoodsDetailShippingInfo';
import { GoodsDetailSummary } from '@project-lc/components-seller/GoodsDetailSummary';
import { LiveShoppingProgressBadge } from '@project-lc/components-shared/LiveShoppingProgressBadge';
import {
  useAdminGoodsById,
  useAdminLiveShoppingList,
  useProfile,
  useUpdateLiveShoppingManageMutation,
} from '@project-lc/hooks';
import { LiveShoppingDTO, LIVE_SHOPPING_PROGRESS } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

function getDuration(startDate: Date, endDate: Date): string {
  if (startDate && startDate) {
    const startTime = dayjs(startDate);
    const endTime = dayjs(endDate);
    const duration = endTime.diff(startTime);
    const hours = duration / (1000 * 60 * 60);
    const stringfiedHours = hours.toFixed(1);
    return `${stringfiedHours}시간`;
  }
  return '미정';
}

export function LiveShoppingDetail(): JSX.Element {
  const router = useRouter();
  const liveShoppingId = router.query.liveShoppingId as string;
  const { data: profileData } = useProfile();
  const { data: liveShopping, isLoading: liveShoppingIsLoading } =
    useAdminLiveShoppingList(
      {
        id: liveShoppingId,
      },
      { enabled: !!profileData?.id },
    );

  const goodsId = liveShopping ? liveShopping[0].goodsId : '';
  const goods = useAdminGoodsById(goodsId);

  const { mutateAsync } = useUpdateLiveShoppingManageMutation();
  const methods = useForm({
    defaultValues: {
      progress: '',
      liveShoppingName: '',
      broadcasterId: '',
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      fmGoodsSeq: null,
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
      progress: '',
      liveShoppingName: '',
      broadcasterId: '',
      broadcastStartDate: '',
      broadcastEndDate: '',
      sellStartDate: '',
      sellEndDate: '',
      rejectionReason: '',
      videoUrl: '',
      fmGoodsSeq: null,
    });
    toast({ title: '변경 완료', status: 'success' });
  };

  const onFail = (err?: AxiosError): void => {
    toast({
      title: '변경 실패',
      description: err.response.status === 400 ? err?.response?.data?.message : undefined,
      status: 'error',
    });
  };

  const { handleSubmit, register, watch, reset } = methods;
  const regist = async (
    data: Omit<LiveShoppingDTO, 'sellerId' | 'goods_id' | 'contactId' | 'requests'>,
  ): Promise<void> => {
    const videoUrlExist = Boolean(liveShopping[0]?.liveShoppingVideo?.youtubeUrl);
    const dto = Object.assign(data, { id: liveShoppingId });
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
              목록으로
            </Button>
          </Flex>
        </Box>
        {/* 상품 제목 */}
        {liveShopping && !liveShoppingIsLoading && (
          <LiveShoppingDetailTitle
            liveShoppingName={liveShopping[0].liveShoppingName}
            createDate={liveShopping[0].createDate}
          />
        )}
        <Grid templateColumns="repeat(2, 1fr)" justifyItems="start" gap={4}>
          <Stack spacing={5}>
            <Stack direction="row">
              <Text as="span">상품명 :</Text>
              <Text color="blue">
                {liveShopping[0].broadcaster
                  ? `${liveShopping[0].goods.goods_name} + ${liveShopping[0].broadcaster.userNickname}`
                  : `${liveShopping[0].goods.goods_name}`}
              </Text>
            </Stack>
            <Stack direction="row">
              <Text as="span">판매자 :</Text>
              <Text color="blue">
                {liveShopping[0].seller.sellerShop?.shopName || ''}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">현재 진행상태</Text>
              <LiveShoppingProgressBadge
                progress={liveShopping[0].progress}
                broadcastStartDate={liveShopping[0].broadcastStartDate}
                broadcastEndDate={liveShopping[0].broadcastEndDate}
                sellEndDate={liveShopping[0].sellEndDate}
              />
              {liveShopping[0].progress === LIVE_SHOPPING_PROGRESS.취소됨 ? (
                <Text>사유 : {liveShopping[0].rejectionReason}</Text>
              ) : null}
            </Stack>

            <Stack>
              <Stack direction="row" alignItems="center">
                <Text>퍼스트몰 상품 번호: </Text>
                <Text
                  as="span"
                  fontWeight="bold"
                  textDecoration={liveShopping[0].fmGoodsSeq ? 'underline' : 'unset'}
                  color={liveShopping[0].fmGoodsSeq ? 'blue' : 'unset'}
                  cursor={liveShopping[0].fmGoodsSeq ? 'pointer' : 'default'}
                  onClick={() => {
                    window.open(
                      `http://whiletrue.firstmall.kr/goods/view?no=${liveShopping[0].fmGoodsSeq}`,
                    );
                  }}
                >
                  {liveShopping[0].fmGoodsSeq || '미입력'}
                </Text>
              </Stack>
              {liveShopping[0].progress === 'confirmed' && !liveShopping[0].fmGoodsSeq && (
                <Alert status="error">
                  <Stack>
                    <AlertIcon />
                    <AlertTitle>퍼스트몰 상품 번호가 입력되지 않았습니다.</AlertTitle>
                    <AlertDescription>
                      진행상태가 확정됨이지만 퍼스트몰 상품 번호가 입력되지 않았습니다.
                      <br />
                      라이브 쇼핑 진행시 사용하는 퍼스트몰 상품 번호가 입력되지 않으면
                      방송인 수익금이 올바르게 처리되지 않습니다.
                    </AlertDescription>
                  </Stack>
                </Alert>
              )}
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">방송인: </Text>
              {liveShopping[0].broadcaster ? (
                <BroadcasterName data={liveShopping[0].broadcaster} color="blue" />
              ) : (
                <Text fontWeight="bold">미정</Text>
              )}
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text as="span">방송시작 시간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcastStartDate
                  ? dayjs(liveShopping[0].broadcastStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송종료 시간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcastEndDate
                  ? dayjs(liveShopping[0].broadcastEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송시간: </Text>
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
                  <Text as="span">영상 URL: </Text>
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
              <Text as="span">판매시작 시간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].sellStartDate
                  ? dayjs(liveShopping[0].sellStartDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">판매종료 시간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].sellEndDate
                  ? dayjs(liveShopping[0].sellEndDate).format('YYYY/MM/DD HH:mm')
                  : '미정'}
              </Text>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Text as="span">판매시간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {getDuration(liveShopping[0].sellStartDate, liveShopping[0].sellEndDate)}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">희망 판매 수수료: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].desiredCommission} %
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">희망 진행 기간: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].desiredPeriod}
              </Text>
            </Stack>

            <Divider />
            <Stack direction="row" alignItems="center">
              <Text as="span">방송인 수수료: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].broadcasterCommissionRate
                  ? `${liveShopping[0].broadcasterCommissionRate}%`
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">와일트루 수수료: </Text>
              <Text as="span" fontWeight="bold" color="blue">
                {liveShopping[0].whiletrueCommissionRate
                  ? `${liveShopping[0].whiletrueCommissionRate}%`
                  : '미정'}
              </Text>
            </Stack>

            <Box>
              <Text>요청사항</Text>
              <Textarea
                resize="none"
                rows={10}
                value={liveShopping[0].requests || ''}
                readOnly
              />
            </Box>
          </Stack>

          {/* 라이브쇼핑 정보 변경 폼 */}
          <FormProvider {...methods}>
            <Stack as="form" spacing={5}>
              <LiveShoppingProgressSelector />
              <Divider />
              <Stack>
                <Text>라이브 쇼핑 이름</Text>
                <Input {...register('liveShoppingName')} />
              </Stack>
              <BroadcasterAutocomplete />
              <Divider />

              <LiveShoppingDatePicker
                title="방송 시작시간"
                registerName="broadcastStartDate"
              />
              <LiveShoppingDatePicker
                title="방송 종료시간"
                registerName="broadcastEndDate"
                min={watch('broadcastStartDate')}
              />
              {dayjs(watch('broadcastStartDate')) > dayjs(watch('broadcastEndDate')) && (
                <Text as="em" color="tomato">
                  방송 종료시간이 시작시간보다 빠릅니다
                </Text>
              )}
              <Divider />

              <LiveShoppingDatePicker
                title="판매 시작시간"
                registerName="sellStartDate"
              />
              <LiveShoppingDatePicker
                title="판매 종료시간"
                registerName="sellEndDate"
                min={watch('sellStartDate')}
              />
              {dayjs(watch('sellStartDate')) > dayjs(watch('sellEndDate')) && (
                <Text as="em" color="tomato">
                  판매 종료시간이 시작시간보다 빠릅니다
                </Text>
              )}
              <Divider />

              <Stack>
                <Text>
                  영상 URL (https://youtu.be/4pIuCJTMXQU 와 같은 형태로 입력해주세요)
                </Text>
                <Input
                  placeholder="https://youtu.be/4pIuCJTMXQU"
                  {...register('videoUrl')}
                />
              </Stack>
              <Divider />

              <Stack maxW="300px">
                <FormControl>
                  <FormLabel>퍼스트몰 상품 번호</FormLabel>
                  <FormLabel color="gray.500" fontSize="xs">
                    해당 라이브를 위해 퍼스트몰에서 생성한 새 상품의 상품 번호를
                    입력하세요.
                  </FormLabel>
                  <FormHelperText fontSize="xs">
                    <Text fontSize="xs" color="red.500" as="span">
                      (주의){' '}
                    </Text>
                    방송인,방송시각등이 확정되었음에도 입력하지 않는 경우, 방송인에게
                    수익금으로 반영되지 않습니다.
                  </FormHelperText>
                  <Input mt={2} type="number" {...register('fmGoodsSeq')} />
                </FormControl>
              </Stack>

              <Button onClick={openConfirmModal} colorScheme="blue">
                변경
              </Button>
              <Button
                rightIcon={<EditIcon />}
                onClick={imageDialogOnOpen}
                isDisabled={!liveShopping[0].broadcaster}
              >
                오버레이 이미지 등록
              </Button>
            </Stack>

            <AdminLiveShoppingUpdateConfirmModal
              isOpen={isOpen}
              onClose={onClose}
              onConfirm={handleSubmit(regist)}
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

export default LiveShoppingDetail;
