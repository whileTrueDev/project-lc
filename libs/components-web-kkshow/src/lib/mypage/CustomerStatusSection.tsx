import { Stack, Text } from '@chakra-ui/react';
import { useProfile } from '@project-lc/hooks';

export function CustomerStatusSection(): JSX.Element {
  const { data, isLoading } = useProfile();

  return (
    <Stack direction={{ base: 'column', md: 'row' }}>
      <Stack direction="row">
        <Text>
          {data?.name} {isLoading}
        </Text>
      </Stack>
      <Stack direction="row">
        <Stack>
          <Text>팔로잉</Text>
          <Text>숫자</Text>
        </Stack>
        <Stack>
          <Text>라이브알림</Text>
          <Text>숫자</Text>
        </Stack>
        <Stack>
          <Text>배송중</Text>
          <Text>숫자</Text>
        </Stack>
      </Stack>
    </Stack>
  );
}
