import { ColorMode, useColorMode } from '@chakra-ui/color-mode';
import { Image, ImageProps } from '@chakra-ui/react';
import { UserType } from '@project-lc/shared-types';
import { useMemo } from 'react';

export const LOGO_S3_PREFIX =
  'https://lc-project.s3.ap-northeast-2.amazonaws.com/kksLogo/';
export const darkLogo = 'kksMainLogoDarkMode.png';
export const darkBigLogo = 'kksMainLogoDarkModeBig.png';
export const lightLogo = 'kksMainLogoLightMode.png';
export const lightBigLogo = 'kksMainLogoLightModeBig.png';
export const whiteLogo = 'kksMainOnlyWhite.png';
// 판매자 로고
export const sellerLogo = 'kkshow-seller-lightmode.png';
export const sellerDarkLogo = 'kkshow-seller-darkmode.png';
// 방송인 로고
export const broadcasterLogo = 'kkshow-broadcaster-lightmode.png';
export const broadcasterDarkLogo = 'kkshow-broadcaster-darkmode.png';

export interface KksLogoProps extends ImageProps {
  appType?: UserType;
  variant?: 'white' | 'dark';
}

interface GetCorrectLogoOption {
  appType: KksLogoProps['appType'];
  colorMode: ColorMode;
  variant?: KksLogoProps['variant'];
}
function getCorrectLogoInfo({
  appType,
  colorMode,
  variant,
}: GetCorrectLogoOption): string {
  if (variant === 'white') return LOGO_S3_PREFIX + whiteLogo;
  if (variant === 'dark') return LOGO_S3_PREFIX + darkLogo;
  switch (appType) {
    case 'broadcaster':
      if (colorMode === 'dark') return LOGO_S3_PREFIX + broadcasterDarkLogo;
      return LOGO_S3_PREFIX + broadcasterLogo;
    case 'seller':
      if (colorMode === 'dark') return LOGO_S3_PREFIX + sellerDarkLogo;
      return LOGO_S3_PREFIX + sellerLogo;
    default: {
      if (colorMode === 'dark') return LOGO_S3_PREFIX + darkLogo;
      return LOGO_S3_PREFIX + lightLogo;
    }
  }
}

/**
 * @author M'baku, Dan
 * @description 이미지 크기가 400x150보다 클 경우 manual 옵션을 사용하세요.
 * 이미지 비율은 x:y = 1.6969 : 1
 */
export function KksLogo({
  appType,
  variant,
  ...props
}: KksLogoProps): JSX.Element | null {
  const { colorMode } = useColorMode();

  const logoSrc = useMemo(
    () => getCorrectLogoInfo({ colorMode, appType, variant }),
    [colorMode, appType, variant],
  );

  if (!appType) {
    return <Image loading="eager" src={logoSrc} width="76.36" height="34" {...props} />;
  }
  return <Image loading="eager" src={logoSrc} width="76.36" height="45" {...props} />;
}

export default KksLogo;
