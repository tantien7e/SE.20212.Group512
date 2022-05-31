import CheckOutTable from '@app/components/CheckOutTable';
import { useTheme } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { Store } from '@app/context/Store';

function CartCheckoutScreen() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const getTotal = () => {
    let sum = 0;
    cart.cartItems.forEach((item) => {
      sum += item.quantity * item.price;
    });
    return sum;
  };
  const theme = useTheme();

  return (
    <div className="screen-container">
      <Helmet>
        <title>Cart Checkout</title>
      </Helmet>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="h4" color={theme.palette.secondary.contrastText}>
          Check-out
        </Typography>{' '}
      </Box>
      <CheckOutTable></CheckOutTable>
      {
        <div
          className="totalCost"
          style={{
            textAlign: 'right',
            fontWeight: 'bold',
            marginTop: '1em',
            fontSize: '1.4rem',
          }}
        >
          <Typography
            variant="h5"
            fontWeight="700"
            color={theme.palette.secondary.contrastText}
          >
            Total Cost: ${getTotal()}
          </Typography>{' '}
        </div>
      }
    </div>
  );
}

export default CartCheckoutScreen;
