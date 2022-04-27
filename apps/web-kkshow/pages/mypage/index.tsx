import { Box } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import { useProfile } from '@project-lc/hooks';

export function Index(): JSX.Element {
  const { data } = useProfile();
  return (
    <KkshowLayout>
      <Box>크크쇼 소비자 마이페이지</Box>
      {data && <Box>{JSON.stringify(data)}</Box>}
    </KkshowLayout>
  );
}

export default Index;
