import { Divider, Stack, Button, useToast } from '@chakra-ui/react';
import { useRegistGoods } from '@project-lc/hooks';
import {
  GoodsOptionDto,
  GoodsOptionsSupplyDto,
  RegistGoodsDto,
} from '@project-lc/shared-types';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';

export function GoodsRegistForm(): JSX.Element {
  const { mutateAsync, isLoading } = useRegistGoods();
  const toast = useToast();

  const supply: GoodsOptionsSupplyDto = {
    stock: 12,
  };

  const options: GoodsOptionDto[] = [
    {
      default_option: 'y',
      option_type: 'as',
      option_title: 'sdf',
      option1: 'sdf',
      consumer_price: 123,
      price: 12334,
      option_view: 'Y',
      supply,
    },
  ];

  const dto: RegistGoodsDto = {
    goods_name: '',
    summary: '',
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

  const regist = () => {
    mutateAsync(dto)
      .then((res) => {
        const { data } = res;
        console.log(data);
        alert(JSON.stringify(data));
        toast({
          title: '상품을 성공적으로 등록하였습니다',
        });
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: '상품 등록 중 오류가 발생하였습니다',
          status: 'error',
        });
      });
  };
  return (
    <Stack p={2} spacing={5}>
      <Button onClick={regist} isLoading={isLoading}>
        등록
      </Button>
      {/* 기본정보 */}
      <GoodsRegistDataBasic />

      {/* 판매정보 */}
      <GoodsRegistDataSales />

      {/* 옵션 */}
      <GoodsRegistDataOptions />
    </Stack>
  );
}

export default GoodsRegistForm;
