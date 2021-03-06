import { ChevronLeftIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ConfirmDialog } from '@project-lc/components-core/ConfirmDialog';
import { useCreateGoodsCommonInfo, useProfile, useRegistGoods } from '@project-lc/hooks';
import { GoodsOptionDto, RegistGoodsDto } from '@project-lc/shared-types';
import { goodsRegistStore } from '@project-lc/stores';
import { s3 } from '@project-lc/utils-s3';
import { useRouter } from 'next/router';
import { FormProvider, NestedValue, useForm } from 'react-hook-form';
import GoodsRegistCategory from './GoodsRegistCategory';
import GoodsRegistCommonInfo from './GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';
import GoodsRegistDescription from './GoodsRegistDescription';
import GoodsRegistExtraInfo from './GoodsRegistExtraInfo';
import GoodsRegistKeywords from './GoodsRegistKeywords';
import GoodsRegistMemo from './GoodsRegistMemo';
import GoodsRegistPictures from './GoodsRegistPictures';
import GoodsRegistShippingPolicy from './GoodsRegistShippingPolicy';

export type GoodsFormOption = Omit<GoodsOptionDto, 'default_option'> & {
  id?: number;
};

export type GoodsFormOptionsType = GoodsFormOption[];

export type GoodsFormValues = Omit<RegistGoodsDto, 'options'> & {
  id?: number;
  options: NestedValue<GoodsFormOptionsType>;
  pictures?: { file: File; filename: string; id: number }[];
  option_title: string; // 옵션명
  option_values: string; // 옵션값 (, 로 분리된 문자열)
  common_contents: string;
  common_contents_name?: string; // 공통 정보 이름
  common_contents_type: 'new' | 'load'; // 공통정보 신규 | 기존 불러오기
};

type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: Omit<GoodsOptionDto, 'default_option'>[];
};

// 상품 사진, 상세설명 이미지를 s3에 업로드 -> url 리턴
export async function uploadGoodsImageToS3(
  imageFile: { file: File | Buffer; filename: string; id: number; contentType: string },
  userMail: string,
): Promise<string> {
  const { file, filename, contentType } = imageFile;
  return s3.s3UploadImage({
    isPublic: true,
    file,
    filename,
    ContentType: contentType,
    userMail,
    type: 'goods',
  });
}

// options 에 default_option설정
export function addGoodsOptionInfo(
  options: Omit<GoodsOptionDto, 'default_option'>[],
): GoodsOptionDto[] {
  return options.map((opt, index) => ({
    ...opt,
    default_option: index === 0 ? ('y' as const) : ('n' as const),
  }));
}

// 상품 '상세설명' contents에서 이미지 s3에 업로드 후 src url 변경
// 상세설명 이미지는data:image 형태로 들어있음
export async function saveContentsImageToS3(
  contents: string,
  userMail: string,
): Promise<string> {
  const parser = new DOMParser();
  const dom = parser.parseFromString(contents, 'text/html'); // textWithImages -> getValues('contents')
  const imageTags = Array.from(dom.querySelectorAll('img'));

  await Promise.all(
    imageTags.map(async (tag, index) => {
      const src = tag.getAttribute('src');
      const name = tag.dataset.fileName || '';
      if (src && src.slice(0, 4) !== 'http') {
        const imageBuffer = Buffer.from(
          src.replace(/^data:image\/\w+;base64,/, ''),
          'base64',
        );
        const fileType = src.substring('data:'.length, src.indexOf(';base64'));
        const url = await uploadGoodsImageToS3(
          { file: imageBuffer, filename: name, id: index, contentType: fileType },
          userMail,
        );
        // img src 바꾸기
        tag.setAttribute('src', url);
      }
    }),
  );

  const contentsBody = dom.body.innerHTML;
  return contentsBody;
}

/** 상품 등록 폼 컴포넌트 */
export function GoodsRegistForm(): JSX.Element {
  const { data: profileData } = useProfile();
  const { mutateAsync, isLoading } = useRegistGoods();
  const { mutateAsync: createGoodsCommonInfo } = useCreateGoodsCommonInfo();
  const toast = useToast();
  const router = useRouter();
  const goBackAlertDialog = useDisclosure();
  const informationNotice = goodsRegistStore((s) => s.informationNotice);

  const methods = useForm<GoodsFormValues>({
    defaultValues: {
      // 판매정보
      goods_status: 'normal', // 판매상태
      cancel_type: '0', // 청약철회, 기본 - 청약철회가능 0
      // 판매옵션
      option_use: '1', // 옵션사용여부, 기본 - 옵션사용 1
      common_contents_type: 'new',
      option_title: '',
      option_values: '',
      image: [],
      options: [],
      searchKeywords: [],
      // 기타정보 (최대, 최소구매수량)
      min_purchase_limit: 'unlimit',
      max_purchase_limit: 'unlimit',
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

  const regist = async (data: GoodsFormSubmitDataType): Promise<void> => {
    if (!profileData) return;
    const userMail = profileData.email;

    const {
      options,
      common_contents_name,
      common_contents_type,
      common_contents,
      max_purchase_ea,
      min_purchase_ea,
      shippingGroupId,
      contents,
      image,
      option_title,
      option_values,
      categoryId,
      ...goodsData
    } = data;

    let goodsDto: RegistGoodsDto = {
      ...goodsData,
      image,
      options: addGoodsOptionInfo(options),
      option_use: options.length > 1 ? '1' : '0',
      max_purchase_ea: Number(max_purchase_ea) || 0,
      min_purchase_ea: Number(min_purchase_ea) || 0,
      shippingGroupId: Number(shippingGroupId) || undefined,
      categoryId,
    };

    // 상품필수정보 (품목별 정보제공고시 정보)
    const informationNoticeDto: Record<string, string> = {};
    console.log('informationNotice: ', informationNotice);
    Object.entries(informationNotice).forEach(([key, value]) => {
      if (!value) {
        // 기본값 처리
        informationNoticeDto[key] = '상세설명 및 상세이미지 참조';
      } else {
        informationNoticeDto[key] = value;
      }
    });
    goodsDto.informationNoticeContents = JSON.stringify(informationNoticeDto);

    if (!categoryId) {
      toast({ description: '상품 카테고리를 선택해주세요', status: 'warning' });
      return;
    }

    if (!shippingGroupId) {
      // 배송비정책 그룹을 선택하지 않은 경우
      toast({ description: '배송비 정책을 선택해주세요', status: 'warning' });
      return;
    }

    if (!image || image.length < 1) {
      // 등록된 사진이 없는 경우
      toast({ description: '상품 사진을 1개 이상 등록해주세요', status: 'warning' });
      return;
    }

    if (options.length === 0) {
      // 등록된 옵션이 없는 경우
      toast({ description: '상품 옵션을 1개 이상 등록해주세요', status: 'warning' });
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
      toast({ description: '상세설명을 입력해주세요', status: 'warning' });
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

    mutateAsync(goodsDto)
      .then(() => {
        toast({ description: '상품을 성공적으로 등록하였습니다', status: 'success' });
        router.push('/mypage/goods');
      })
      .catch((error) => {
        console.error(error);
        toast({ description: '상품 등록 중 오류가 발생하였습니다', status: 'error' });
      });
  };

  return (
    <FormProvider {...methods}>
      <Stack p={2} spacing={5} as="form" onSubmit={handleSubmit(regist)}>
        <Stack
          py={2}
          mx={-2}
          direction="row"
          position="sticky"
          bgColor={useColorModeValue('white', 'gray.800')}
          top="0px"
          left="0px"
          right="0px"
          justifyContent="space-between"
          zIndex="sticky"
        >
          <Button leftIcon={<ChevronLeftIcon />} onClick={goBackAlertDialog.onOpen}>
            상품목록 돌아가기
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            등록
          </Button>
        </Stack>

        {/* 기본정보 */}
        <GoodsRegistDataBasic />

        {/* 상품 카테고리 정보 */}
        <GoodsRegistCategory />

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
        <GoodsRegistShippingPolicy sellerId={profileData?.id} />

        {/* 상품 키워드 정보 */}
        <GoodsRegistKeywords />

        {/* 기타정보 - 최소, 최대구매수량 */}
        <GoodsRegistExtraInfo />

        {/* 메모 - textArea */}
        <GoodsRegistMemo />

        {/* 뒤로가기 - 입력된 정보 사라짐 안내 다이얼로그 */}
        <ConfirmDialog
          title="상품 목록으로 돌아가기"
          isOpen={goBackAlertDialog.isOpen}
          onClose={goBackAlertDialog.onClose}
          onConfirm={async () => {
            router.push('/mypage/goods');
          }}
        >
          <Alert status="warning">
            <AlertIcon />
            <Stack spacing={1}>
              <Text> 목록으로 이동시 입력했던 정보는 모두 사라집니다!</Text>
              <Text>상품 정보를 모두 입력했다면 등록 버튼을 눌러 완료해주세요</Text>
            </Stack>
          </Alert>
          <Text mt={3}>정말 상품 목록으로 이동하시겠습니까?</Text>
        </ConfirmDialog>

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
            <Text>상품을 등록중입니다...</Text>
          </Center>
        )}
      </Stack>
    </FormProvider>
  );
}
