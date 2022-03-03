import { Button, Flex, Text } from '@chakra-ui/react';

export function StartGuideCard({ onOpen }: { onOpen: () => void }): JSX.Element {
  return (
    <Flex
      borderRadius="md"
      borderWidth="1px"
      flexDir="column"
      alignItems="center"
      justifyContent="space-between"
      p={3}
      h={150}
    >
      <Text fontWeight="bold">
        <Text as="span" color="red.500">
          [필수]
        </Text>
        &nbsp; 크크쇼 시작 가이드
      </Text>

      <Button variant="solid" onClick={onOpen}>
        시작하기
      </Button>
    </Flex>
  );
}
