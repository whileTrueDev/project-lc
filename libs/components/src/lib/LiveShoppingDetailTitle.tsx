import { Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { TextDotConnector } from '..';

export function LiveShoppingDetailTitle({ liveShopping }: any): JSX.Element {
  return (
    <>
      <Heading>{liveShopping.goods.goods_name}</Heading>
      <Stack direction="row" alignItems="center">
        <Text>등록시간</Text>
        <TextDotConnector />
        <Text>{dayjs(liveShopping.createDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </Stack>
    </>
  );
}
