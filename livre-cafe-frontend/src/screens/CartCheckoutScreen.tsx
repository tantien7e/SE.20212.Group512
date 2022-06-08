import CheckOutTable from '@app/components/CheckOutTable';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Button } from '@mui/material';
import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CartItemInterface, Store } from '@app/context/Store';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import MenuDropdownButton from '@app/components/MenuDropdownButton';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import PrintOrderModal from '@app/components/PrintOrderModal';
import { getCartTotal } from '@app/utils';

function CartCheckoutScreen() {
  const { state } = useContext(Store);
  const { cart } = state;
  const [printOrderModalOpen, setPrintOrderModalOpen] = useState(false);

  const theme = useTheme();

  return (
    <div className="screen-container">
      <Helmet>
        <title>Cart Checkout</title>
      </Helmet>
      <PrintOrderModal
        open={printOrderModalOpen}
        handleClose={() => setPrintOrderModalOpen(false)}
      />
      <Box sx={{ marginBottom: theme.spacing(5) }}>
        <Typography variant="h4" color={theme.palette.secondary.contrastText}>
          Check-out
        </Typography>{' '}
      </Box>
      <MenuDropdownButton
        dropdownList={[
          {
            content: 'Quick Checkout',
            icon: <ElectricBoltIcon />,
            handleClick: () => setPrintOrderModalOpen(true),
          },
          { content: 'Normal Checkout', icon: <ShoppingCartCheckoutIcon /> },
        ]}
        disabled={!cart.cartItems?.length}
      >
        Checkout
      </MenuDropdownButton>
      <Box sx={{ margin: `${theme.spacing(2)} 0` }}>
        <CheckOutTable />
      </Box>
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
            Subtotal: ${getCartTotal(cart.cartItems)}
          </Typography>{' '}
        </div>
      }
    </div>
  );
}

export default CartCheckoutScreen;
