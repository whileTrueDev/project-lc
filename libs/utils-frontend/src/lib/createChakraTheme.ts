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
        // 스크롤바 영역전체
        '::-webkit-scrollbar': {
          width: '6px', // vertical
          height: '9px', // horizontal
          opacity: 0.7,
        },
        // 스크롤바 바 없는 부분
        '::-webkit-scrollbar-track': {
          opacity: 0.7,
        },
        // 스크롤바 바 부분
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'gray',
          borderRadius: '26px',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: mode('gray.600', 'gray.300')(props),
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
