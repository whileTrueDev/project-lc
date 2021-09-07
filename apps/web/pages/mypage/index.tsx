import { Box, Text } from '@chakra-ui/react';
import { MypageLayout, StoreInfoDialog } from '@project-lc/components';

export function Index(): JSX.Element {
  return (
    <MypageLayout>
      <Box h={200} bgColor="red.200" as="section">
        <Text>some components1</Text>
      </Box>
      <Box h={200} bgColor="blue.200" as="section">
        <Text>some components2</Text>
      </Box>
      {/* 상점명 입력 다이얼로그 (useProfile 내부에서 사용) */}
      <StoreInfoDialog />
    </MypageLayout>
  );
}

export default Index;
