import CheckOutTable from '@app/components/CheckOutTable';
import React from 'react';
import { Helmet } from 'react-helmet-async';

function CartCheckoutScreen() {
  return (
    <div>
      <Helmet>
        <title>Cart Checkout</title>
      </Helmet>

      <CheckOutTable></CheckOutTable>
    </div>
  );
}

export default CartCheckoutScreen;
