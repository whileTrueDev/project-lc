import { Center, Heading, Box, BoxProps } from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';

export interface KkshowMainTitleProps {
  color?: BoxProps['bgColor'];
  children: React.ReactChild | React.ReactChild[];
  bulletPosition?: 'left-top' | 'top' | 'left';
  bulletSize?: number;
  bulletVariant?: 'fill' | 'outline';
  distance?: number;
  centered?: boolean;
}
export function KkshowMainTitle({
  color = 'blue.500',
  children,
  bulletSize = 3,
  distance = 4,
  centered = true,
  bulletPosition = 'left-top',
  bulletVariant = 'fill',
}: KkshowMainTitleProps): JSX.Element {
  return (
    <MotionBox
      as={centered ? Center : Box}
      mb={{ base: 6, md: 10 }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0, transition: { duration: 0.6 } }}
      viewport={{ once: true, amount: 0.9 }}
    >
      <Heading fontSize="3xl" position="relative">
        <Box
          position="absolute"
          w={bulletSize}
          h={bulletSize}
          left={bulletPosition.includes('left') ? -distance : 0}
          top={bulletPosition.includes('top') ? -distance : 0}
          bgColor={bulletVariant === 'fill' ? color : 'transparent'}
          borderWidth={bulletVariant === 'outline' ? 'thin' : 'unset'}
          borderColor={color}
          borderRadius="full"
        />
        {children}
      </Heading>
    </MotionBox>
  );
}

export default KkshowMainTitle;
