import { Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { TextDotConnector } from '..';

export function LiveShoppingDetailTitle(props: {
  goodsName: string;
  createDate: Date;
}): JSX.Element {
  const { goodsName, createDate } = props;
  return (
    <>
      <Heading>{goodsName}</Heading>
      <Stack direction="row" alignItems="center">
        <Text>등록시간</Text>
        <TextDotConnector />
        <Text>{dayjs(createDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </Stack>
    </>
  );
}
