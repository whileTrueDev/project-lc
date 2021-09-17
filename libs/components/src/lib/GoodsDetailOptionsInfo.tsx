import { Box, Stack, Text } from '@chakra-ui/react';
import { GoodsByIdRes } from '@project-lc/shared-types';

export interface GoodsDetailOptionsInfoProps {
  goods: GoodsByIdRes;
}
export function GoodsDetailOptionsInfo({ goods }: GoodsDetailOptionsInfoProps) {
  return (
    <Stack>
      <Text fontWeight="bold">옵션</Text>

      <Box>
        {goods.options.map((option) => (
          <Box key={option.id}>
            <Text>{option.default_option === 'y' ? '필수옵션' : '필수옵션아님'}</Text>
            <Text>option.option_title: {option.option_title}</Text>
            <Text>option.option1: {option.option1}</Text>
            <Text>option.price: {option.price}</Text>
            <Text>option.weight: {option.weight}</Text>
            <Text>option.option_view: {option.option_view}</Text>
            <Text>option.supply.stock: {option.supply.stock}</Text>
            <Text>option.supply.badstock: {option.supply.badstock}</Text>
            <Text>option.supply.safe_stock: {option.supply.safe_stock}</Text>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
