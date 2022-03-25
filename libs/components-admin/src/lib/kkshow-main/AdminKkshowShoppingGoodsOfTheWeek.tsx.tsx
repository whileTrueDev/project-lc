import { AddIcon } from '@chakra-ui/icons';
import { Flex, Text, Box, Input, Button, ButtonGroup } from '@chakra-ui/react';
import { KkshowShoppingTabResData } from '@project-lc/shared-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

export interface AdminKkshowShoppingGoodsOfTheWeekProps {
  index: number;
}
export function AdminKkshowShoppingGoodsOfTheWeek({
  index,
}: AdminKkshowShoppingGoodsOfTheWeekProps): JSX.Element {
  const methods = useFormContext<KkshowShoppingTabResData>();

  return (
    <Flex gap={3}>
      <Box>
        <Text>순서</Text>
        <Text>{index + 1}</Text>
      </Box>
      <Box>
        <Text>이미지 주소</Text>
        <Input {...methods.register(`goodsOfTheWeek.${index}.imageUrl` as const)} />
      </Box>
      <Box>
        <Text>상품명</Text>
        <Input {...methods.register(`goodsOfTheWeek.${index}.name` as const)} />
      </Box>
      <Box>
        <Text>정가</Text>
        <Input {...methods.register(`goodsOfTheWeek.${index}.normalPrice` as const)} />
      </Box>
      <Box>
        <Text>할인가</Text>
        <Input
          {...methods.register(`goodsOfTheWeek.${index}.discountedPrice` as const)}
        />
      </Box>
    </Flex>
  );
}

export default AdminKkshowShoppingGoodsOfTheWeek;
