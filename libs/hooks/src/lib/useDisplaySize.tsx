import { useBreakpoint } from '@chakra-ui/react';
import { useMemo } from 'react';

export interface DisplaySizes {
  xSize: string | undefined;
  isMobileSize: boolean | '' | undefined;
  isMiddleSize: boolean | '' | undefined;
  isDesktopSize: boolean | '' | undefined;
}

/**
 * 화면 사이즈 변수를 사용합니다. 모바일 사이즈인지, 데스크탑 사이즈인지를 구별합니다.
 * - xSize => 현재 화면 x축 사이즈 ("base", "sm", "md", "lg", "xl", "2xl", "4xl", ...)
 * - isMobileSize => 화면이 작은 경우 true, 이외 false
 * - isMiddleSize => 화면이 중간 크기인 경우 true, 이외 false
 * - isDesktopSize => 화면이 큰 경우 true, 이외 false
 */
export const useDisplaySize = (): DisplaySizes => {
  const xSize = useBreakpoint();
  const isMobileSize = useMemo(() => xSize && ['base', 'sm'].includes(xSize), [xSize]);
  const isMiddleSize = useMemo(() => xSize && ['md', 'lg'].includes(xSize), [xSize]);
  const isDesktopSize = useMemo(
    () => xSize && !['md', 'lg', 'base', 'sm'].includes(xSize),
    [xSize],
  );
  return { xSize, isMobileSize, isMiddleSize, isDesktopSize };
};
