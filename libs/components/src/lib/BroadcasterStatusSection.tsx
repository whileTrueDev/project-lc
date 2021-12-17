// 현재의 검수상태를 보여주는 컴포넌트
import { Grid, Flex } from '@chakra-ui/react';
import { GridTableItem } from './GridTableItem';

export function BroadcasterStatusSection({
  status,
}: {
  status: {
    email: string;
    phoneNumber: string;
  };
}): JSX.Element {
  return (
    <Flex direction="row" maxW="700" m={2}>
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
        <GridTableItem title="이메일" value={status.email} />
      </Grid>
      <Grid templateColumns="2fr 3fr" borderTopWidth={1.5} width={['100%', '70%']}>
        <GridTableItem title="휴대 전화" value={status.phoneNumber} />
      </Grid>
    </Flex>
  );
}
