import { Box, BoxProps, useColorModeValue } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { MotionBox } from './MotionBox';

/** 웨이브 애니메이션 컴포넌트 */
export function WaveBox(boxProps: BoxProps): JSX.Element {
  const waveImage = useColorModeValue(
    'images/main/wave.png',
    'images/main/dark-wave.png',
  );
  const { isMobileSize } = useDisplaySize();
  const waveXSize = isMobileSize ? 400 : 1200;
  const waveYSize = isMobileSize ? 55 : 100;
  return (
    <Box minH={waveYSize} bgColor={boxProps.bgColor ?? 'blue.500'} {...boxProps}>
      {boxProps.children}
      <MotionBox
        h={waveYSize}
        bottom={0}
        left={0}
        lineHeight={0}
        w="100%"
        overflow="hidden"
        // transform="rotate(180deg)"
        backgroundRepeat="no-repeat"
        background={`url(${waveImage})`}
        backgroundSize={{
          base: `${waveXSize}px ${waveYSize}px`,
          md: `${waveXSize}px ${waveYSize}px`,
        }}
        animate={{
          backgroundPositionX: `${waveXSize}px`,
          transition: {
            duration: isMobileSize ? 8 : 15,
            ease: [0.3, 0.45, 0.6, 0.5],
            repeat: Infinity,
          },
        }}
      />
    </Box>
  );
}

export default WaveBox;
