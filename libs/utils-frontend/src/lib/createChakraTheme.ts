import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const blueColorPalette = {
  50: '#b2deff',
  100: '#79cefc',
  200: '#17acfc',
  300: '#179dfc',
  400: '#2a71fa',
  500: '#1751fd',
  600: '#123bb5',
  700: '#123b7d',
  800: '#0b2f61',
  900: '#082247',
};
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createChakraTheme = () =>
  extendTheme({
    styles: {
      global: (props: any) => ({
        body: {
          color: mode('gray.800', 'whiteAlpha.900')(props),
          bg: mode('white', 'gray.800')(props),
        },
      }),
    },
    fonts: {
      heading: 'Gmarket Sans',
      body: "'Noto Sans KR', sans-serif;",
    },
    colors: {
      // 브랜드 컬러는 향후 정해지면 변경
      // 아래는 더미
      blue: blueColorPalette,
      brand: blueColorPalette,
    },
  });
