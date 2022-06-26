import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import InventoryScreen from '@app/screens/InventoryScreen';
import SideNav from '@app/components/SideNav';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';
import {
  CART_CHECKOUT_PATH,
  CUSTOMERS_PATH,
  INVENTORY_PATH,
  ORDERS_PATH,
} from '@app/constants';
import '@app/styles/main.scss';
import CustomersScreen from '@app/screens/CustomersScreen';
import { ToastContainer } from 'react-toastify';
import OrdersScreen from '@app/screens/OrdersScreen';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === '/') navigate('/inventory');
  }, []);
  const theme = useTheme();

  return (
    <Box className="app-container" display="flex">
      <SideNav />
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Routes>
          <Route path="/" element={<InventoryScreen />} />
          <Route path={INVENTORY_PATH} element={<InventoryScreen />} />
          <Route path={CART_CHECKOUT_PATH} element={<CartCheckoutScreen />} />
          <Route path={CUSTOMERS_PATH} element={<CustomersScreen />} />
          <Route path={ORDERS_PATH} element={<OrdersScreen />} />

          {/* <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signin" element={<SigninScreen />} /> */}
        </Routes>
      </main>
    </Box>
  );
}

export default App;
