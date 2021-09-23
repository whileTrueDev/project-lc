/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, useToast } from '@chakra-ui/react';
import { s3, useProfile, useRegistGoods } from '@project-lc/hooks';
import { GoodsOptionDto, RegistGoodsDto, GoodsImageDto } from '@project-lc/shared-types';
import { String } from 'aws-sdk/clients/codebuild';
import { FormProvider, useForm, NestedValue } from 'react-hook-form';
import GoodsRegistCommonInfo from './GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';
import GoodsRegistDescription from './GoodsRegistDescription';
import GoodsRegistExtraInfo from './GoodsRegistExtraInfo';
import GoodsRegistMemo from './GoodsRegistMemo';
import GoodsRegistPictures, { Preview } from './GoodsRegistPictures';
import GoodsRegistShippingPolicy from './GoodsRegistShippingPolicy';

type GoodsFormOptionsType = Omit<GoodsOptionDto, 'default_option' | 'option_title'>[];

export type GoodsFormValues = Omit<RegistGoodsDto, 'options' | 'image'> & {
  options: NestedValue<GoodsFormOptionsType>;
  // image?: Preview[];
  image?: { file: File; filename: string; id: number }[];
  option_title: string;
};

type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: Omit<GoodsOptionDto, 'option_title' | 'default_option'>[];
};

// 상품 사진을 s3에 업로드 -> url 리턴
async function uploadImageToS3(
  imageFile: { file: File; filename: string; id: number },
  userMail: string,
) {
  const { file, filename } = imageFile;

  const type = 'goods';

  const savedImageName = await s3.s3UploadImage({
    filename,
    userMail,
    type,
    file,
  });

  if (!savedImageName) {
    throw new Error('S3 ERROR');
  }

  const { key, fileName } = s3.getS3Key({ userMail, type, filename });

  return [
    'https://',
    process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
    '.s3.',
    'ap-northeast-2',
    '.amazonaws.com/',
    key,
    fileName,
  ].join('');
}

// 여러 상품 이미지를 s3에 업로드 후 imageDto로 변경
async function imageFileListToImageDto(
  imageFileList: { file: File; filename: string; id: number }[],
  userMail: string,
) {
  const savedImages = await Promise.all(
    imageFileList.map((file) => uploadImageToS3(file, userMail)),
  );
  return savedImages.map((img, index) => ({
    cut_number: index,
    image: img,
  }));
}

// options 에 default_option, option_title설정
function addGoodsOptionInfo(
  options: Omit<GoodsOptionDto, 'default_option' | 'option_title'>[],
  option_title: string,
) {
  return options.map((opt, index) => ({
    ...opt,
    default_option: index === 0 ? ('y' as const) : ('n' as const),
    option_title,
  }));
}

export function GoodsRegistForm(): JSX.Element {
  const { data: profileData } = useProfile();
  // const { mutateAsync, isLoading } = useRegistGoods();
  const toast = useToast();

  const methods = useForm<GoodsFormValues>({
    defaultValues: {
      option_title: '',
      image: [],
      options: [
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
    },
  });
  const { handleSubmit } = methods;

  const regist = async (data: GoodsFormSubmitDataType) => {
    const {
      image,
      options,
      option_title,
      max_purchase_ea,
      min_purchase_ea,
      shippingGroupId,
      ...goodsData
    } = data;

    const goodsDto: RegistGoodsDto = {
      ...goodsData,
      options: addGoodsOptionInfo(options, option_title),
      option_use: options.length > 1 ? '1' : '0',
      max_purchase_ea: max_purchase_ea || 0,
      min_purchase_ea: max_purchase_ea || 0,
      shippingGroupId: shippingGroupId || undefined,
      image:
        image && image.length > 0
          ? await imageFileListToImageDto(image, profileData?.email || '')
          : [],
    };
    console.log(goodsDto);

    // TODO: goods 필수컬럼(options의 옵션값 등등) 다시 확인후 테이블, dto 수정
    // mutateAsync(ddto)
    //   .then((res) => {
    //     const { data: d } = res;
    //     console.log(d);
    //     alert(JSON.stringify(d));
    //     toast({
    //       title: '상품을 성공적으로 등록하였습니다',
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     toast({
    //       title: '상품 등록 중 오류가 발생하였습니다',
    //       status: 'error',
    //     });
    //   });
  };
  return (
    <FormProvider {...methods}>
      <Stack p={2} spacing={5} as="form" onSubmit={handleSubmit(regist)}>
        <Button type="submit">등록</Button>
        {/* 기본정보 */}
        {/* <GoodsRegistDataBasic /> */}

        {/* 판매정보 */}
        {/* <GoodsRegistDataSales /> */}

        {/* 옵션 */}
        {/* <GoodsRegistDataOptions /> */}

        {/* //TODO: 사진 - (다이얼로그)여러 이미지 등록 가능, 최대 8개, 각 이미지는 10mb제한 */}
        <GoodsRegistPictures />

        {/* //TODO: 상세설명 -  (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록, 이미지는 최대 20mb 제한, 주로 이미지로 등록함 */}
        {/* <GoodsRegistDescription /> */}

        {/* //TODO: 공통정보 => 교환/반품/배송에 표시됨 (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록,
      내가 생성한 공통정보 조회, 선택기능 포함  */}
        {/* <GoodsRegistCommonInfo /> */}

        {/* 배송정책 (내가 생성한 배송정책 조회 기능 + 선택 기능 포함), 배송정책 등록 다이얼로그와 연결 */}
        {/* <GoodsRegistShippingPolicy /> */}

        {/* 기타정보 - 최소, 최대구매수량 */}
        {/* <GoodsRegistExtraInfo /> */}

        {/* 메모 - textArea */}
        {/* <GoodsRegistMemo /> */}
      </Stack>
    </FormProvider>
  );
}

export default GoodsRegistForm;
