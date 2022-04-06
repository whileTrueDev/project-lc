import { mode } from '@chakra-ui/theme-tools';

export const scrollStyle = (props: any): Record<string, any> => ({
  '@media only screen and (max-width: 768px)': {
    '::-webkit-scrollbar': {
      width: '0px', // vertical
      height: '7px', // horizontal
      background: 'transparent',
    },
  },
  '@media only screen and (min-width: 768px)': {
    // 스크롤바 영역전체
    '::-webkit-scrollbar': {
      width: '6px', // vertical
      height: '7px', // horizontal
      opacity: 0.7,
    },
  },

  // 스크롤바 바 없는 부분
  '::-webkit-scrollbar-track': {
    opacity: 0.7,
    background: 'transparent',
  },
  // 스크롤바 바 부분
  '::-webkit-scrollbar-thumb': {
    backgroundColor: mode('gray.300', 'gray.500')(props),
    borderRadius: '3px',
  },
  '::-webkit-scrollbar-thumb:horizontal': {
    borderRadius: '6px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: mode('gray.400', 'gray.400')(props),
  },
});

export default scrollStyle;
