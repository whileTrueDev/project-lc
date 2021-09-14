import { Divider, Stack } from '@chakra-ui/react';
import GoodsRegistDataBasic from './GoodsRegistDataBasic';
import GoodsRegistDataOptions from './GoodsRegistDataOptions';
import GoodsRegistDataSales from './GoodsRegistDataSales';

export function GoodsRegistForm(): JSX.Element {
  return (
    <Stack p={2} spacing={5}>
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
