import { createTheme } from '@mui/material/styles';

const lightPurple = '#7c69ef';
const lightGray = '#f1f4f8';
const hoverButton = 'rgba(0, 0, 0, 0.04)';
const textGray = '#495057';
const darkBlue = '#506690';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      inActive: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      inActive?: string;
      badgeActive?: string;
    };
  }
}

const theme = createTheme({
  status: {
    inActive: textGray,
  },

  palette: {
    primary: {
      main: lightPurple,
      // contrastText: 'white',
      // dark: textGray,
    },
    secondary: {
      main: lightGray,
      light: hoverButton,
      contrastText: darkBlue,
    },
    // common: {
    //   white: textGray,
    // },
  },
  typography: {
    fontFamily: [
      'Source Sans Pro',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
  },
});

export default theme;
