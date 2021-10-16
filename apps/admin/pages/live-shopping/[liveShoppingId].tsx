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
} from '@project-lc/components';
import {
  useAdminLiveShoppingList,
  useProfile,
  useBroadcaster,
  useAdminGoodsById,
} from '@project-lc/hooks';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';

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

  const methods = useForm({
    defaultValues: {
      progress: '',
      broadcaster: '',
      startDate: '',
      endDate: '',
    },
  });

  const { handleSubmit } = methods;
  const regist = (data: any) => {
    console.log(data);
  };

  if (liveShoppingIsLoading || goods.isLoading)
    return <AdminPageLayout>...loading</AdminPageLayout>;

  if (!goods.isLoading && !goods.data)
    return <AdminPageLayout>...no data</AdminPageLayout>;

  /**
  - **신청됨**: 신청 직후의 상태
  - **조율중**: 신청을 확인, 라이브 진행 방송인 선정부터 일정 등을 조율하고 있는 상태
  - **확정됨**: 라이브 진행할 방송인 선정완료, 일정 수립 완료된 상태
  - **라이브진행중**: 현재 라이브 방송 진행중인 상태. (→ 입력된 방송 시간에 따라 자동으로 렌더링 변경)
  - **라이브진행완료**: 라이브 방송 진행이 완료된 상태. (→ 입력된 방송 시간 자동으로 렌더링 변경)
  - **판매완료**: 라이브 방송 이후 판매까지 완료된 상태 (→ 판매 시간에 따라 자동으로 렌더링 변경)
  - [기획오류. 진행안함]**~~부분정산완료**: 이 라이브를 통해 진행한 주문 중 일부가 정산된 상태~~
  - [기획오류. 진행안함]**~~정산완료**: 이 라이브를 통해 진행한 주문이 모두 정산된 상태~~
  - **취소됨**: 라이브 진행이 취소됨 (사유 필요)
 */

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
              <Badge>{liveShopping[0].progress}</Badge>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송인: </Text>
              <Text as="span">
                {liveShopping[0].broadcaster
                  ? liveShopping[0].broadcaster.userNickname
                  : '미정'}
              </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송시작 시간: </Text>
              <Text as="span">{liveShopping[0].startBroadcastDate || '미정'}</Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송종료 시간: </Text>
              <Text as="span">{liveShopping[0].endBroadcastDate || '미정'} </Text>
            </Stack>

            <Stack direction="row" alignItems="center">
              <Text as="span">방송시간: </Text>
              <Text as="span">미정</Text>
            </Stack>
          </Stack>
          <FormProvider {...methods}>
            <Stack as="form" spacing={5} onSubmit={handleSubmit(regist)}>
              <LiveShoppingProgressSelector />
              <BroadcasterAutocomplete data={broadcaster} />
              <LiveShoppingDatePicker title="시작시간" registerName="startDate" />
              <LiveShoppingDatePicker title="종료시간" registerName="endDate" />
              <Button type="submit">등록</Button>
            </Stack>
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
