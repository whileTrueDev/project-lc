import { Center, Spinner } from '@chakra-ui/react';

export function FullscreenLoading(): JSX.Element {
  return (
    <Center
      position="fixed"
      left="0"
      top="0"
      width="100vw"
      height="100vh"
      opacity="0.5"
      bg="gray"
    >
      <Spinner />
    </Center>
  );
}

export default FullscreenLoading;
