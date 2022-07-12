import { Box, Button, Flex, Stack, Text } from '@chakra-ui/react';
import router from 'next/router';
import React, { PropsWithChildren } from 'react';

interface MypageErrorBoundrayState {
  hasError: boolean;
}
type MypageErrorBoundrayProps = PropsWithChildren<Record<string, unknown>>;
export class MypageErrorBoundray extends React.Component<
  MypageErrorBoundrayProps,
  MypageErrorBoundrayState
> {
  constructor(props: MypageErrorBoundrayProps) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): { hasError: boolean } {
    // Update state so the next render will show the fallback UI

    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown): void {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }

  render(): React.ReactNode {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Flex h="80vh" justify="center" align="center">
          <Stack textAlign="center" spacing={4} p={8}>
            <Box>
              <Text>죄송합니다.</Text>
              <Text>페이지를 표시하는 도중 오류가 발생했습니다.</Text>
            </Box>
            <Stack>
              <Button onClick={() => router.back()}>뒤로가기</Button>
            </Stack>
          </Stack>
        </Flex>
      );
    }

    // Return children components in case of no error
    return this.props.children;
  }
}

export default MypageErrorBoundray;
