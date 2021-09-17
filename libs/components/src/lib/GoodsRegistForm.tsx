/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, useToast } from '@chakra-ui/react';
import { useRegistGoods } from '@project-lc/hooks';
import { GoodsOptionDto, RegistGoodsDto, GoodsImageDto } from '@project-lc/shared-types';
import { FormProvider, useForm, NestedValue } from 'react-hook-form';
import GoodsRegistCommonInfo from './GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';
import GoodsRegistDescription from './GoodsRegistDescription';
import GoodsRegistExtraInfo from './GoodsRegistExtraInfo';
import GoodsRegistMemo from './GoodsRegistMemo';
import GoodsRegistPictures from './GoodsRegistPictures';
import GoodsRegistShippingPolicy from './GoodsRegistShippingPolicy';

type GoodsFormOptionsType = Omit<GoodsOptionDto, 'default_option' | 'option_title'>[];

export type GoodsFormValues = Omit<RegistGoodsDto, 'options' | 'image'> & {
  options: NestedValue<GoodsFormOptionsType>;
  image?: string[];
  option_title: string;
};

type GoodsFormSubmitDataType = Omit<GoodsFormValues, 'options'> & {
  options: Omit<GoodsOptionDto, 'option_title' | 'default_option'>[];
};

function goodsFormDataToDto(formData: GoodsFormSubmitDataType) {
  const {
    image,
    options,
    option_title,
    max_purchase_ea,
    min_purchase_ea,
    shippingGroupId,
    ...goodsData
  } = formData;

  console.log({ shippingGroupId });
  // options 에 default_option, option_title설정
  const optionsDto: GoodsOptionDto[] = options.map((opt, index) => ({
    ...opt,
    default_option: index === 0 ? 'y' : 'n',
    option_title,
  }));

  const a: RegistGoodsDto = {
    ...goodsData,
    options: optionsDto,
    option_use: optionsDto.length > 1 ? '1' : '0',
    max_purchase_ea: max_purchase_ea || 0,
    min_purchase_ea: max_purchase_ea || 0,
    shippingGroupId: shippingGroupId || undefined,
    image: image
      ? image.map((img, index) => ({
          image: img, // TODO: mutateAsync(dto) 하기 전에 image를 s3에 업로드
          cut_number: index,
        }))
      : [],
  };
  return a;
}

const tempoptions: GoodsOptionDto[] = [
  {
    default_option: 'y',
    option_type: 'direct',
    option_title: 'sdf',
    option1: 'sdf',
    consumer_price: 123,
    price: 12334,
    option_view: 'Y',
    supply: { stock: 14 },
  },
  {
    default_option: 'y',
    option_type: 'direct',
    option_title: '12321sdf',
    option1: 's223df',
    consumer_price: 12343,
    price: 1452334,
    option_view: 'Y',
    supply: { stock: 34 },
  },
];

const dto: RegistGoodsDto = {
  goods_name: 'testgoods',
  summary: 'desc sum',
  goods_status: 'normal',
  cancel_type: '1',
  common_contents: 'd',
  shipping_policy: 'goods',
  goods_shipping_policy: 'limit',
  shipping_weight_policy: 'goods',
  min_purchase_limit: 'limit',
  option_use: '1',
  option_view_type: 'divide',
  option_suboption_use: '1',
  member_input_use: '1',
  image: [],
  goods_view: 'look',
  max_purchase_limit: 'limit',
  options: tempoptions,
};

export function GoodsRegistForm(): JSX.Element {
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

  const regist = (data: GoodsFormSubmitDataType) => {
    // TODO: options 에 default_option, option_title설정
    // TODO: mutateAsync(dto) 하기 전에 image를 s3에 업로드
    const ddto = goodsFormDataToDto(data);
    console.log(ddto);

    // 입력값 확인 (options의 옵션값 등등)

    // TODO: goods 필수컬럼 다시 확인후 테이블, dto 수정
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
        {/* <GoodsRegistPictures /> */}

        {/* //TODO: 상세설명 -  (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록, 이미지는 최대 20mb 제한, 주로 이미지로 등록함 */}
        {/* <GoodsRegistDescription /> */}

        {/* //TODO: 공통정보 => 교환/반품/배송에 표시됨 (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록,
      내가 생성한 공통정보 조회, 선택기능 포함  */}
        {/* <GoodsRegistCommonInfo /> */}

        {/* //TODO: 배송정책 (내가 생성한 배송정책 조회 기능 + 선택 기능 포함), 배송정책 등록 다이얼로그와 연결 */}
        <GoodsRegistShippingPolicy />

        {/* 기타정보 - 최소, 최대구매수량 */}
        {/* <GoodsRegistExtraInfo /> */}

        {/* 메모 - textArea */}
        {/* <GoodsRegistMemo /> */}
      </Stack>
    </FormProvider>
  );
}

export default GoodsRegistForm;
