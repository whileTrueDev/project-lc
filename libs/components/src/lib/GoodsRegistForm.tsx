/* eslint-disable react/jsx-props-no-spreading */
import { Button, Stack, useToast } from '@chakra-ui/react';
import { useRegistGoods } from '@project-lc/hooks';
import { GoodsOptionDto, RegistGoodsDto } from '@project-lc/shared-types';
import { FormProvider, useForm } from 'react-hook-form';
import GoodsRegistCommonInfo from './GoodsRegistCommonInfo';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';
import GoodsRegistDescription from './GoodsRegistDescription';
import GoodsRegistExtraInfo from './GoodsRegistExtraInfo';
import GoodsRegistMemo from './GoodsRegistMemo';
import GoodsRegistPictures from './GoodsRegistPictures';
import GoodsRegistShippingPolicy from './GoodsRegistShippingPolicy';

export function GoodsRegistForm(): JSX.Element {
  const { mutateAsync, isLoading } = useRegistGoods();
  const toast = useToast();

  const methods = useForm<RegistGoodsDto>();
  const { handleSubmit } = methods;

  const options: GoodsOptionDto[] = [
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
    image: '',
    goods_view: 'look',
    max_purchase_limit: 'limit',
    options,
  };

  const regist = (data: RegistGoodsDto) => {
    const { image, ...goodsData } = data;
    alert(JSON.stringify(goodsData));
    console.log(goodsData);
    console.log(image);

    // TODO: mutateAsync(dto) 하기 전에 image를 s3에 업로드
    // mutateAsync(dto)
    //   .then((res) => {
    //     const { data } = res;
    //     console.log(data);
    //     alert(JSON.stringify(data));
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
        <Button type="submit" isLoading={isLoading}>
          등록
        </Button>
        {/* 기본정보 */}
        <GoodsRegistDataBasic />

        {/* 판매정보 */}
        <GoodsRegistDataSales />

        {/* 옵션 */}
        <GoodsRegistDataOptions />

        {/* 사진 - (다이얼로그)여러 이미지 등록 가능, 최대 8개, 각 이미지는 10mb제한 */}
        {/* <GoodsRegistPictures /> */}

        {/* 상세설명 -  (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록, 이미지는 최대 20mb 제한, 주로 이미지로 등록함 */}
        <GoodsRegistDescription />

        {/* 공통정보 => 교환/반품/배송에 표시됨 (다이얼로그, 에디터 필요) 에디터로 글/이미지 동시 등록,
      내가 생성한 공통정보 조회, 선택기능 포함  */}
        <GoodsRegistCommonInfo />

        {/* 배송정책 (내가 생성한 배송정책 조회 기능 + 선택 기능 포함), 배송정책 등록 다이얼로그와 연결 */}
        <GoodsRegistShippingPolicy />

        {/* 기타정보 - 최소, 최대구매수량 */}
        <GoodsRegistExtraInfo />

        {/* 메모 - textArea */}
        <GoodsRegistMemo />
      </Stack>
    </FormProvider>
  );
}

export default GoodsRegistForm;
