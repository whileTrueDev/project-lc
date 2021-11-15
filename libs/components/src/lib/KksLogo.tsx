import { useColorMode } from '@chakra-ui/react';
import { ChakraNextImage } from './ChakraNextImage';

export const darkLogoUrl =
  'https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoDarkMode.png';
export const darkBigLogoUrl =
  'https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoDarkModeBig.png';
export const lightLogoUrl =
  'https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightMode.png';
export const lightBigLogoUrl =
  'https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightModeBig.png';

export interface KksLogoProps {
  size: 'small' | 'mid' | 'big' | 'manual';
  width?: number;
  height?: number;
}

/**
 * @author M'baku
 * @description 이미지 크기가 400x150보다 클 경우 manual 옵션을 사용하세요
 */
export function KksLogo(props: KksLogoProps): JSX.Element {
  const { size, width, height } = props;
  const { colorMode } = useColorMode();

  return (
    <>
      {size === 'small' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage src={darkLogoUrl} width="120" height="45" />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage src={lightLogoUrl} width="120" height="45" />
          )}
        </>
      )}

      {size === 'mid' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage src={darkLogoUrl} width="260" height="82" />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage src={lightLogoUrl} width="260" height="82" />
          )}
        </>
      )}

      {size === 'big' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage src={darkLogoUrl} width="400" height="150" />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage src={lightLogoUrl} width="400" height="150" />
          )}
        </>
      )}

      {size === 'manual' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage src={darkBigLogoUrl} width={width} height={height} />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage src={lightBigLogoUrl} width={width} height={height} />
          )}
        </>
      )}
    </>
  );
}

export default KksLogo;
