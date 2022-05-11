import theme from '@app/constants/theme';
import { StoreProvider } from '@app/context/Store';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* <Provider store={store}> */}
      <BrowserRouter>
        <StoreProvider>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StoreProvider>
      </BrowserRouter>
      {/* </Provider> */}
    </HelmetProvider>
  </React.StrictMode>,
);
