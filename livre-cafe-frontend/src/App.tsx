import { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import InventoryScreen from '@app/screens/InventoryScreen';
import SideNav from '@app/components/SideNav';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app-container">
      <SideNav />
      <main>
        <Routes>
          <Route path="/" element={<InventoryScreen />} />
          {/* <Route path="/products/:slug" element={<ProductScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/signin" element={<SigninScreen />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
