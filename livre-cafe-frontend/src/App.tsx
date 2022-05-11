import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import InventoryScreen from '@app/screens/InventoryScreen';
import SideNav from '@app/components/SideNav';
import { Box } from '@mui/material';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';
import {
  CART_CHECKOUT_PATH,
  CUSTOMERS_PATH,
  INVENTORY_PATH,
} from '@app/constants';
import '@app/styles/main.scss';
import CustomersScreen from '@app/screens/CustomersScreen';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname === '/') navigate('/inventory');
  }, []);

  return (
    <Box className="app-container" display="flex">
      <SideNav />
      <main>
        <Routes>
          <Route path="/" element={<InventoryScreen />} />
          <Route path={INVENTORY_PATH} element={<InventoryScreen />} />
          <Route path={CART_CHECKOUT_PATH} element={<CartCheckoutScreen />} />
          <Route path={CUSTOMERS_PATH} element={<CustomersScreen />} />

          {/* <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signin" element={<SigninScreen />} /> */}
        </Routes>
      </main>
    </Box>
  );
}

export default App;
