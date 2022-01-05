import { Center, Divider } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';

export function ResponsiveDivider(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  return (
    <Center height={isMobileSize ? 'auto' : '80px'}>
      <Divider orientation={isMobileSize ? 'horizontal' : 'vertical'} />
    </Center>
  );
}
