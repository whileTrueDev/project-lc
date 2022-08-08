import { Center, Spinner } from '@chakra-ui/react';

/**
 * 전체화면에 회색 backdrop & 가운데 로딩 인디케이터 보여주는 컴포넌트
 */
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
      zIndex="overlay" // sticky보다 큰 값
    >
      <Spinner />
    </Center>
  );
}

export default FullscreenLoading;
