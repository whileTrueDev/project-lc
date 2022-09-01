import { Stack, Flex, Box, Text, Image } from '@chakra-ui/react';

export interface OverlayDisplayPreviewProps {
  _backgroundImage?: string;
  _podiumImage?: string;
  _timerImage?: string;
  _backgroundColor?: string;
  _color?: string;
  _titleColor?: string;
  _textShadow?: string;
}
export function OverlayDisplayPreview({
  _backgroundImage,
  _podiumImage,
  _timerImage,
  _backgroundColor,
  _color,
  _titleColor,
  _textShadow,
}: OverlayDisplayPreviewProps): JSX.Element {
  const value = 0.25;
  const backgroundImageUrl = _backgroundImage ? `url(${_backgroundImage})` : undefined;

  const podiumImageUrl = _podiumImage;
  const timerImageUrl = _timerImage;

  const bgColor = _backgroundColor || 'rgba(0,0,0,0.5)';
  const fontColor = _color || '#fff';

  const titleColor = _titleColor || 'yellow';
  const textShadow =
    _textShadow ||
    `-2px -2px 0 rgb(85, 83, 83), 0 -2px 0 rgb(85, 83, 83),
2px -2px 0 rgb(85, 83, 83), 2px 0 0 rgb(85, 83, 83), 2px 2px 0 rgb(85, 83, 83),
0 2px 0 rgb(85, 83, 83), -2px 2px 0 rgb(85, 83, 83), -2px 0 0 rgb(85, 83, 83)`;
  return (
    <Box
      width={`${1920 * value}px`}
      height={`${1080 * value}px`}
      position="relative"
      outline="auto"
      outlineColor="blue.300"
      backgroundImage={backgroundImageUrl}
      backgroundRepeat="no-repeat"
      backgroundSize="contain"
      overflow="hidden"
    >
      <Text
        fontWeight="extrabold"
        color="grayText"
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
      >
        배경이미지 확인을 위한 <br />
        오버레이 화면 예시
      </Text>
      <Stack
        position="absolute"
        width={`${400 * value}px`}
        height="100%"
        top={`${50 * value}px`}
        left={`${15 * value}px`}
        color="#fff"
      >
        <Flex
          flexDirection="column"
          width="100%"
          height={`${240 * value}px`}
          rounded="lg"
          bg={bgColor}
          color={fontColor}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontWeight="extrabold" color={titleColor} textShadow={textShadow}>
            TOP 구매자
          </Text>
          <Image src={podiumImageUrl} width="35px" height="35px" />
        </Flex>
        <Box width="100%" height="50%" rounded="lg" bg="gray" />
        <Flex
          width="100%"
          height="10%"
          rounded="lg"
          bg={bgColor}
          color={fontColor}
          alignItems="center"
          justifyContent="space-around"
        >
          <Image src={timerImageUrl} width="25px" height="25px" />
          <Text>00:00:00</Text>
        </Flex>
      </Stack>
    </Box>
  );
}

export default OverlayDisplayPreview;
