import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import InventoryScreen from '@app/screens/InventoryScreen';
import SideNav from '@app/components/SideNav';
import { Box } from '@mui/material';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Box className="app-container" display="flex">
      <SideNav />
      <main>
        <Routes>
          <Route path="/" element={<InventoryScreen />} />
          <Route path="/cart-checkout" element={<CartCheckoutScreen />} />
          {/* <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signin" element={<SigninScreen />} /> */}
        </Routes>
      </main>
    </Box>
  );
}

export default App;
