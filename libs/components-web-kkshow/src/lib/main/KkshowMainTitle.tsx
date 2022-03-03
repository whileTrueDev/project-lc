import { Center, Heading, Box } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';

export interface KkshowMainTitleProps {
  color?: 'red' | 'blue';
  children: React.ReactChild;
  size?: number;
  distance?: number;
}
export function KkshowMainTitle({
  color = 'blue',
  children,
  size = 3,
  distance = 4,
}: KkshowMainTitleProps): JSX.Element {
  return (
    <MotionBox
      as={Center}
      mb={10}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
      viewport={{ once: true }}
    >
      <Heading fontSize="3xl" position="relative">
        <Box
          position="absolute"
          w={size}
          h={size}
          left={-distance}
          top={-distance}
          bgColor={color}
          borderRadius="full"
        />
        {children}
      </Heading>
    </MotionBox>
  );
}

export default KkshowMainTitle;
