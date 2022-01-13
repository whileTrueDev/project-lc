import { Heading, Stack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

export function LiveShoppingDetailTitle(props: {
  liveShoppingName: string;
  createDate: Date;
}): JSX.Element {
  const { liveShoppingName, createDate } = props;
  return (
    <>
      {liveShoppingName ? (
        <Heading>{liveShoppingName}</Heading>
      ) : (
        <Heading color="tomato">⚠️ 라이브 쇼핑 이름을 등록해주세요 ⚠️</Heading>
      )}
      <Stack direction="row" alignItems="center">
        <Text>등록시간: </Text>
        <Text>{dayjs(createDate).format('YYYY-MM-DD HH:mm:ss')}</Text>
      </Stack>
    </>
  );
}
