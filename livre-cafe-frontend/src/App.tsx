import {
  selectVerify,
  verify,
} from '@app/app/features/authentication/authentication-slice';
import SideNav from '@app/components/SideNav';
import {
  CART_CHECKOUT_PATH,
  CUSTOMERS_PATH,
  INVENTORY_PATH,
  LOGIN_PATH,
  ORDERS_PATH,
} from '@app/constants';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';
import CustomersScreen from '@app/screens/CustomersScreen';
import InventoryScreen from '@app/screens/InventoryScreen';
import LoginScreen from '@app/screens/LoginScreen';
import OrdersScreen from '@app/screens/OrdersScreen';
import '@app/styles/main.scss';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isVerified = useSelector(selectVerify);
  const dispatch = useDispatch();
  useEffect(() => {
    if (pathname === '/') {
      navigate('/inventory');
    }
  }, []);
  const theme = useTheme();

  return (
    <Box className="app-container" display="flex">
      {pathname !== LOGIN_PATH && isVerified && <SideNav />}
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: theme.palette.secondary.main,
        }}
      >
        <Routes>
          <Route path={INVENTORY_PATH} element={<InventoryScreen />} />
          <Route path={CART_CHECKOUT_PATH} element={<CartCheckoutScreen />} />
          <Route path={CUSTOMERS_PATH} element={<CustomersScreen />} />
          <Route path={ORDERS_PATH} element={<OrdersScreen />} />
          <Route path={LOGIN_PATH} element={<LoginScreen />} />

          {/* <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signin" element={<SigninScreen />} /> */}
        </Routes>
      </main>
    </Box>
  );
}

export default App;
