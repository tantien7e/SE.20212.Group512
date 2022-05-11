import { createTheme } from '@mui/material/styles';

const lightPurple = '#7c69ef';
const lightGray = '#f1f4f8';
const hoverButton = 'rgba(0, 0, 0, 0.04)';
const textGray = '#495057';

const theme = createTheme({
  palette: {
    primary: {
      main: lightPurple,
      contrastText: textGray,
    },
    secondary: {
      main: lightGray,
      light: hoverButton,
    },
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
  },
});

export default theme;
