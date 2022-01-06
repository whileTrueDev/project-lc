import { extendTheme } from '@chakra-ui/react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createChakraTheme = () =>
  extendTheme({
    fonts: {
      heading: 'Gmarket Sans',
      body: "'Noto Sans KR', sans-serif;",
    },
    colors: {
      // 브랜드 컬러는 향후 정해지면 변경
      // 아래는 더미
      brand: {
        50: '#f9fbe7',
        100: '#f0f4c3',
        200: '#e6ee9c',
        300: '#dce775',
        400: '#d4e157',
        500: '#cddc39',
        600: '#c0ca33',
        700: '#afb42b',
        800: '#9e9d24',
        900: '#827717',
      },
    },
  });
