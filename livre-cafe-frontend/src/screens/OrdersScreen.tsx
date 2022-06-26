import {
  fetchOrders,
  selectOrders,
} from '@app/app/features/orders/orders-slice';
import OrdersTable from '@app/components/OrdersTable';
import { stableSort } from '@app/utils';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

function OrdersScreen() {
  const theme = useTheme();

  const dispatch = useDispatch();
  const ordersSelector = useSelector(selectOrders);
  const { orders, loading } = ordersSelector;

  useEffect(() => {
    if (!orders || orders.length < 1) dispatch(fetchOrders());
  }, [orders, dispatch]);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      <Helmet>
        <title>Inventory</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(2) }}>
        <Typography
          variant="h5"
          color={theme.palette.secondary.contrastText}
          fontWeight={600}
        >
          Orders
        </Typography>{' '}
      </Box>
      <OrdersTable
        rows={orders || []}
        stableSort={stableSort}
        isLoading={loading}
      />
    </Box>
  );
}

export default OrdersScreen;
