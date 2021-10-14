import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  theme,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useCreateGoodsCommonInfo, useProfile, useEditGoods } from '@project-lc/hooks';
import { GoodsByIdRes, RegistGoodsDto } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import GoodsRegistCommonInfo from './GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';
import GoodsRegistDescription from './GoodsRegistDescription';
import GoodsRegistExtraInfo from './GoodsRegistExtraInfo';
import {
  addGoodsOptionInfo,
  GoodsFormOption,
  GoodsFormValues,
  saveContentsImageToS3,
} from './GoodsRegistForm';
import GoodsRegistMemo from './GoodsRegistMemo';
import GoodsRegistPictures from './GoodsRegistPictures';
import GoodsRegistShippingPolicy from './GoodsRegistShippingPolicy';

type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: GoodsFormOption[];
};

/** 상품 수정 폼 컴포넌트 */
export function GoodsEditForm({ goodsData }: { goodsData?: GoodsByIdRes }): JSX.Element {
  const { data: profileData } = useProfile();
  const { mutateAsync: editGoodsRequest, isLoading } = useEditGoods();
  const { mutateAsync: createGoodsCommonInfo } = useCreateGoodsCommonInfo();
  const toast = useToast();
  const router = useRouter();

  const methods = useForm<GoodsFormValues>({
    defaultValues: {
      // 상품 id (상품 수정하는 경우 id 존재, 상품 등록하는 경우 id undefined)
      id: goodsData?.id || undefined,
      // 기본정보
      goods_name: goodsData?.goods_name || undefined, // 상품명
      summary: goodsData?.summary || undefined, // 간략설명
      // 판매정보
      goods_status: goodsData ? goodsData.goods_status : 'normal', // 판매상태
      cancel_type: goodsData ? goodsData.cancel_type : '0', // 청약철회, 기본 - 청약철회가능 0
      // 판매옵션
      option_use: goodsData ? goodsData.option_use : '1', // 옵션사용여부, 기본 - 옵션사용 1
      option_title: goodsData?.options[0].option_title || '',
      options: goodsData
        ? goodsData.options.map((opt) => ({
            id: opt.id,
            option_type: opt.option_type,
            option1: opt.option1 || '',
            consumer_price: Number(opt.consumer_price),
            price: Number(opt.price),
            option_view: opt.option_view,
            supply: {
              stock: opt.supply.stock,
            },
          }))
        : [
            {
              option_type: 'direct',
              option1: '',
              consumer_price: 0,
              price: 0,
              option_view: 'Y',
              supply: {
                stock: 0,
              },
            },
          ],
      // 상품사진
      image: goodsData?.image || [],
      // 상세설명
      contents: goodsData?.contents || undefined,
      // 상품공통정보
      goodsInfoId: goodsData?.goodsInfoId || undefined,
      common_contents_type: goodsData ? 'load' : 'new',
      common_contents: goodsData?.GoodsInfo?.info_value,
      common_contents_name: goodsData?.GoodsInfo?.info_name,
      // 배송비정책
      shippingGroupId: goodsData?.shippingGroupId || undefined,
      // 기타정보 (최대, 최소구매수량)
      min_purchase_limit: goodsData?.min_purchase_limit || 'unlimit',
      min_purchase_ea: goodsData?.min_purchase_ea || undefined,
      max_purchase_limit: goodsData?.max_purchase_limit || 'unlimit',
      max_purchase_ea: goodsData?.max_purchase_ea || undefined,
      // 메모
      admin_memo: goodsData?.admin_memo || undefined,
      // 이하 fm_goods 기본값
      goods_view: 'look',
      shipping_policy: 'shop',
      goods_shipping_policy: 'unlimit',
      shipping_weight_policy: 'shop',
      option_view_type: 'divide',
      option_suboption_use: '0',
      member_input_use: '0',
    },
  });
  const { handleSubmit } = methods;

  const editGoods = async (data: GoodsFormSubmitDataType): Promise<void> => {
    if (!profileData || !goodsData) return;
    const userMail = profileData.email;

    const {
      id,
      options,
      option_title,
      common_contents_name,
      common_contents_type,
      common_contents,
      max_purchase_ea,
      min_purchase_ea,
      shippingGroupId,
      contents,
      image,
      ...goodsFormData
    } = data;

    if (!id) return;

    let goodsDto: RegistGoodsDto = {
      ...goodsFormData,
      image,
      options: addGoodsOptionInfo(options, option_title),
      option_use: options.length > 1 ? '1' : '0',
      max_purchase_ea: Number(max_purchase_ea) || 0,
      min_purchase_ea: Number(min_purchase_ea) || 0,
      shippingGroupId: Number(shippingGroupId) || undefined,
    };

    if (!shippingGroupId) {
      // 배송비정책 그룹을 선택하지 않은 경우
      toast({
        title: '배송비 정책을 선택해주세요',
        status: 'warning',
      });
      return;
    }

    if (!image || image.length < 1) {
      // 등록된 사진이 없는 경우
      toast({
        title: '상품 사진을 1개 이상 등록해주세요',
        status: 'warning',
      });
      return;
    }

    // 상세설명을 입력한 경우
    if (contents && contents !== '<p><br></p>') {
      const contentsBody = await saveContentsImageToS3(contents, userMail);
      goodsDto = {
        ...goodsDto,
        contents: contentsBody,
        contents_mobile: contentsBody,
      };
    } else {
      // 상세설명을 입력하지 않은 경우 - 상품 수정 기능이 없는 동안 필수값으로 설정함
      toast({ title: '상세설명을 입력해주세요', status: 'warning' });
      return;
    }

    // 공통정보 신규생성 & 공통정보를 입력한 경우
    if (
      common_contents_type === 'new' &&
      !!common_contents &&
      common_contents !== '<p><br></p>'
    ) {
      // 공통정보 생성 -> 해당 아이디를 commonInfoId에 추가
      const commonInfoBody = await saveContentsImageToS3(common_contents, userMail);
      const res = await createGoodsCommonInfo({
        info_name: common_contents_name || '',
        info_value: commonInfoBody,
      });

      goodsDto = {
        ...goodsDto,
        goodsInfoId: res.id,
      };
    } else if (!data.goodsInfoId) {
      // 상품 공통정보 없는 경우 (신규등록 안함 & 기존정보 불러오기도 안함)
      toast({
        title: '상품 공통 정보를 입력하거나 기존 정보를 불러와서 등록해주세요',
        status: 'warning',
      });
      return;
    }

    editGoodsRequest({ id, dto: goodsDto })
      .then(() => {
        toast({
          title: '상품을 성공적으로 수정하였습니다',
          status: 'success',
        });

        router.push(`/mypage/goods/${id}`);
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '상품 수정 중 오류가 발생하였습니다',
          status: 'error',
        });
      });
  };

  return (
    <FormProvider {...methods}>
      <Stack p={2} spacing={5} as="form" onSubmit={handleSubmit(editGoods)}>
        <Stack
          py={4}
          mx={-2}
          direction="row"
          position="sticky"
          bgColor={useColorModeValue('white', 'gray.800')}
          top="0px"
          left="0px"
          right="0px"
          justifyContent="space-between"
          zIndex={theme.zIndices.sticky}
        >
          <Button leftIcon={<ChevronLeftIcon />} onClick={router.back}>
            돌아가기
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            저장하기
          </Button>
        </Stack>

        {/* 기본정보 */}
        <GoodsRegistDataBasic />

        {/* 판매정보 */}
        <GoodsRegistDataSales />

        {/* 판매 옵션 */}
        <GoodsRegistDataOptions />

        {/* 상품사진 - (다이얼로그)여러 이미지 등록 가능, 최대 8개 */}
        <GoodsRegistPictures />

        {/* 상세설명 -  (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록, 이미지는 최대 20mb 제한, 주로 이미지로 등록함 */}
        <GoodsRegistDescription />

        {/* 상품 공통 정보 => 교환/반품/배송에 표시됨 (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록,
      내가 생성한 공통정보 조회, 선택기능 포함  */}
        <GoodsRegistCommonInfo />

        {/* 배송비 (내가 생성한 배송정책 조회 기능 + 선택 기능 포함), 배송정책 등록 다이얼로그와 연결 */}
        <GoodsRegistShippingPolicy />

        {/* 기타정보 - 최소, 최대구매수량 */}
        <GoodsRegistExtraInfo />

        {/* 메모 - textArea */}
        <GoodsRegistMemo />

        {isLoading && (
          <Center
            position="fixed"
            top="-30px"
            bottom="0px"
            left="0px"
            right="0px"
            bg="gray.400"
            opacity="0.5"
            flexDirection="column"
            zIndex={99999}
          >
            <Spinner />
            <Text>상품 정보를 수정중입니다...</Text>
          </Center>
        )}
      </Stack>
    </FormProvider>
  );
}

export default GoodsEditForm;
