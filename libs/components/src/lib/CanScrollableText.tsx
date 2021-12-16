import { Kbd, Text } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';

export function CanScrollableText(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  if (isMobileSize) return <Text as="span">목록을 좌,우로 슬라이드 할 수 있습니다.</Text>;
  return (
    <Text as="span">
      <Kbd>shift</Kbd> + <Kbd>마우스스크롤</Kbd> 을 통해 목록을 좌,우로 스크롤할 수
      있습니다.
    </Text>
  );
}
