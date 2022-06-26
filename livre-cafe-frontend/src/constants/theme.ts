import { createTheme } from '@mui/material/styles';

const lightPurple = '#7c69ef';
const lightGray = '#f1f4f8';
const hoverButton = 'rgba(0, 0, 0, 0.04)';
const textGray = '#495057';
const darkBlue = '#506690';
export const grayBackground = '#f8f8f8';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      inActive: string;
    };
    block?: {
      gray: string;
      cancelled: {
        fontColor: string;
        backgroundColor: string;
      };

      pending: {
        fontColor: string;
        backgroundColor: string;
      };

      completed: {
        fontColor: string;
        backgroundColor: string;
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      inActive?: string;
      badgeActive?: string;
    };

    block?: {
      gray: string;
      cancelled: {
        fontColor: string;
        backgroundColor: string;
      };

      pending: {
        fontColor: string;
        backgroundColor: string;
      };

      completed: {
        fontColor: string;
        backgroundColor: string;
      };
    };
  }
}

const theme = createTheme({
  status: {
    inActive: textGray,
  },

  block: {
    gray: grayBackground,
    cancelled: {
      fontColor: '#de486c',
      backgroundColor: '#fdf4f6',
    },

    pending: {
      fontColor: '#ffae00',
      backgroundColor: '#fff7e6',
    },

    completed: {
      fontColor: '#2fb182',
      backgroundColor: '#ebf9f4',
    },
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
    // h5: {
    //   color: darkBlue,
    // },
    // h6: {
    //   color: darkBlue,
    // },
  },
});

export default theme;
