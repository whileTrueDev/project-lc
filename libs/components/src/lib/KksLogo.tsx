import { useColorMode } from '@chakra-ui/react';
import { ChakraNextImage } from './ChakraNextImage';

export interface KksLogoProps {
  size: string;
}

export function KksLogo(props: KksLogoProps): JSX.Element {
  const { size } = props;
  const { colorMode } = useColorMode();

  return (
    <>
      {size === 'small' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoDarkModeSmall.png"
              width="130"
              height="41"
            />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightModeSmall.png"
              width="130"
              height="41"
            />
          )}
        </>
      )}

      {size === 'mid' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoDarkModeMid.png"
              width="260"
              height="82"
            />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightModeMid.png"
              width="260"
              height="82"
            />
          )}
        </>
      )}

      {size === 'big' && (
        <>
          {colorMode === 'dark' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoDarkModeBig.png"
              width="390"
              height="123"
            />
          )}

          {colorMode === 'light' && (
            <ChakraNextImage
              src="https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/kksMainLogoLightModeBig.png"
              width="390"
              height="123"
            />
          )}
        </>
      )}
    </>
  );
}

export default KksLogo;
