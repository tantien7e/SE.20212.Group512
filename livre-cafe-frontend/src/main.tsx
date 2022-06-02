import theme from '@app/constants/theme';
import { StoreProvider } from '@app/context/Store';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './App';
import './styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { store } from '@app/app/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContainer />
    <HelmetProvider>
      <Provider store={store}>
        <BrowserRouter>
          <StoreProvider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </StoreProvider>
        </BrowserRouter>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>,
);
