import { createTheme, Theme } from '@material-ui/core';
import { cyan } from '@material-ui/core/colors';

export const createMuiTheme = (): Theme =>
  createTheme({
    palette: {
      primary: {
        // primary 컬러는 향후 브랜드 컬러 및 브랜딩 정해지면 변경
        // 아래는 더미
        light: cyan['400'],
        main: cyan['500'],
        dark: cyan['600'],
      },
    },
  });
