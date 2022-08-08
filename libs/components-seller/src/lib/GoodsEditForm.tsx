import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import {
  useCreateGoodsCommonInfo,
  useEditGoods,
  useGoodsOnLiveFlag,
  useProfile,
} from '@project-lc/hooks';
import {
  GoodsByIdRes,
  GoodsFormOption,
  GoodsFormValues,
  RegistGoodsDto,
} from '@project-lc/shared-types';
import { goodsRegistStore } from '@project-lc/stores';
import { saveContentsImageToS3 } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import GoodsRegistCategory from './goods-regist/GoodsRegistCategory';
import GoodsRegistCommonInfo from './goods-regist/GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './goods-regist/GoodsRegistDataBasic';
import GoodsRegistDataOptions from './goods-regist/GoodsRegistDataOptions';
import GoodsRegistDataSales from './goods-regist/GoodsRegistDataSales';
import GoodsRegistDescription from './goods-regist/GoodsRegistDescription';
import GoodsRegistExtraInfo from './goods-regist/GoodsRegistExtraInfo';
import { addGoodsOptionInfo } from './goods-regist/GoodsRegistForm';
import { GoodsRegistInformationNotice } from './goods-regist/GoodsRegistInformationNotice';
import GoodsRegistKeywords from './goods-regist/GoodsRegistKeywords';
import GoodsRegistMemo from './goods-regist/GoodsRegistMemo';
import GoodsRegistPictures from './goods-regist/GoodsRegistPictures';
import GoodsRegistShippingPolicy from './goods-regist/GoodsRegistShippingPolicy';

type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: GoodsFormOption[];
};

/** 상품 수정 폼 컴포넌트 */
export function GoodsEditForm({ goodsData }: { goodsData: GoodsByIdRes }): JSX.Element {
  const { data: profileData } = useProfile();
  const { mutateAsync: editGoodsRequest, isLoading } = useEditGoods();
  const { mutateAsync: createGoodsCommonInfo } = useCreateGoodsCommonInfo();
  const toast = useToast();
  const router = useRouter();

  const methods = useForm<GoodsFormValues>({
    defaultValues: {
      id: goodsData.id,
      // 기본정보
      goods_name: goodsData?.goods_name || undefined, // 상품명
      summary: goodsData?.summary || undefined, // 간략설명
      // 판매정보
      goods_status: goodsData ? goodsData.goods_status : 'normal', // 판매상태
      cancel_type: goodsData ? goodsData.cancel_type : '0', // 청약철회, 기본 - 청약철회가능 0
      // 판매옵션
      option_use: goodsData ? goodsData.option_use : '1', // 옵션사용여부, 기본 - 옵션사용 1
      option_title: '',
      option_values: '',
      options: goodsData
        ? goodsData.options.map((opt) => ({
            id: opt.id,
            option_type: opt.option_type,
            option_title: opt.option_title || '',
            option1: opt.option1 || '',
            consumer_price: Number(opt.consumer_price),
            price: Number(opt.price),
            option_view: opt.option_view,
            supply: {
              stock: opt.supply.stock,
            },
          }))
        : [],
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
      searchKeywords:
        goodsData.searchKeyword?.split(',').map((k) => ({ keyword: k })) || [],
    },
  });

  const informationNotice = goodsRegistStore((s) => s.informationNotice);
  const selectedCategories = goodsRegistStore((s) => s.selectedCategories);
  const resetSelectedCategories = goodsRegistStore((s) => s.resetSelectedCategories);
  const setInformationSubjectId = goodsRegistStore((s) => s.setInformationSubjectId);
  const setSelectedCategories = goodsRegistStore((s) => s.setSelectedCategories);

  // 마운트 이후 최초 1번만 실행 - 상품정보제공고시 카테고리 품목 초기화
  useEffect(() => {
    setInformationSubjectId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카테고리 초기값 구성
  // && 상품정보제공고시 내용 초기값 구성
  const initializeNotice = goodsRegistStore((s) => s.initializeNotice);
  useEffect(() => {
    if (goodsData) {
      setSelectedCategories(goodsData.categories);
      initializeNotice(goodsData.informationNotice?.contents);
    }
  }, [goodsData, setSelectedCategories, initializeNotice]);

  const { handleSubmit } = methods;

  const editGoods = async (data: GoodsFormSubmitDataType): Promise<void> => {
    if (!profileData || !goodsData || !goodsData.seller.email) return;
    const userMail = goodsData.seller.email;

    const {
      id,
      options,
      option_title,
      option_values,
      common_contents_name,
      common_contents_type,
      common_contents,
      max_purchase_ea,
      min_purchase_ea,
      shippingGroupId,
      contents,
      image,
      categoryIdList,
      ...goodsFormData
    } = data;

    if (!id) return;

    let goodsDto: RegistGoodsDto = {
      ...goodsFormData,
      image,
      options: addGoodsOptionInfo(options),
      option_use: options.length > 1 ? '1' : '0',
      max_purchase_ea: Number(max_purchase_ea) || 0,
      min_purchase_ea: Number(min_purchase_ea) || 0,
      shippingGroupId: Number(shippingGroupId) || undefined,
      categoryIdList: selectedCategories.map((cat) => cat.id),
    };

    // * 상품 카테고리 확인
    if (goodsDto.categoryIdList.length < 1) {
      toast({ description: '상품 카테고리를 선택해주세요', status: 'warning' });
      return;
    }

    // 상품필수정보 (품목별 정보제공고시 정보) => 수정페이지에서는 상품등록시 작성한 값이 존재하므로 상품필수정보 품목(informationSubjectId) 선택여부는 확인하지 않는다
    const informationNoticeDto: Record<string, string> = {};
    Object.entries(informationNotice).forEach(([key, value]) => {
      if (!value) {
        // 기본값 처리
        informationNoticeDto[key] = '상세설명 및 상세이미지 참조';
      } else {
        informationNoticeDto[key] = value;
      }
    });
    goodsDto.informationNoticeContents = JSON.stringify(informationNoticeDto);

    // * 상품필수정보 내용 확인
    if (goodsDto.informationNoticeContents === '{}') {
      // 상품정보제공고시 내용이 빈객체인 경우 - 항목 선택 안함 혹은 값을 입력하지 않음
      toast({
        description: '상품정보제공고시 카테고리 품목을 선택하고 값을 입력해주세요',
        status: 'warning',
      });
      return;
    }

    if (options.length === 0) {
      // 등록된 옵션이 없는 경우
      toast({
        title: '상품 옵션을 1개 이상 등록해주세요',
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
        description: '상품 공통 정보를 입력하거나 기존 정보를 불러와서 등록해주세요',
        status: 'warning',
      });
      return;
    }

    if (!shippingGroupId) {
      // 배송비정책 그룹을 선택하지 않은 경우
      toast({
        title: '배송비 정책을 선택해주세요',
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
        resetSelectedCategories(); // GoodsRegistStore에서 선택된 카테고리 목록 초기화
        setInformationSubjectId(null); // 선택된 품목id 초기화
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

  const onLiveShopping = useGoodsOnLiveFlag(goodsData);
  const fixedStackBgColor = useColorModeValue('white', 'gray.800');

  if (onLiveShopping) {
    return (
      <Stack spacing={10} py={10}>
        <Text>해당 상품은 라이브 쇼핑 진행중인 상품으로 수정할 수 없습니다</Text>
        <Box>
          <Button leftIcon={<ChevronLeftIcon />} onClick={router.back}>
            돌아가기
          </Button>
        </Box>
      </Stack>
    );
  }

  return (
    <FormProvider {...methods}>
      <Stack p={2} spacing={5} as="form" onSubmit={handleSubmit(editGoods)}>
        <Stack
          py={4}
          direction="row"
          position="sticky"
          bgColor={fixedStackBgColor}
          top="0px"
          left="0px"
          right="0px"
          justifyContent="space-between"
          zIndex="sticky"
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

        {/* 상품 카테고리 정보 */}
        <GoodsRegistCategory />

        {/* 상품정보제공고시 */}
        <GoodsRegistInformationNotice />

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
        <GoodsRegistShippingPolicy sellerId={goodsData.seller.id} />

        {/* 상품 키워드 정보 */}
        <GoodsRegistKeywords />

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
