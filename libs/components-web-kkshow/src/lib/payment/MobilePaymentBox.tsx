import { Box, Button, Text, Flex, useColorModeValue } from '@chakra-ui/react';

export function MobilePaymentBox(): JSX.Element {
  return (
    <Box w="100%">
      <Flex justifyContent="space-evenly" alignItems="center">
        <Box>
          <Text>결제금액</Text>
          <Text>10,000원</Text>
        </Box>
        <Button size="sm">결제</Button>
      </Flex>
    </Box>
  );
}
