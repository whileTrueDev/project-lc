import { Box, Text, Button } from '@chakra-ui/react';

export function StartGuideCard({ onOpen }: { onOpen: () => void }): JSX.Element {
  return (
    <>
      <Box
        borderRadius="md"
        borderWidth="1px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        p={3}
      >
        <Text fontWeight="bold">
          <Text as="span" color="red.500">
            [필수]
          </Text>
          &nbsp; 크크쇼 시작 가이드
        </Text>

        <Button variant="solid" size="sm" onClick={onOpen}>
          시작하기
        </Button>
      </Box>
    </>
  );
}
