import {
  fetchCustomers,
  selectCustomers
} from '@app/app/features/customers/customers-slice';
import DataCustomersTable from '@app/components/DataCustomersTable';
import {
  CustomerGender, RankType
} from '@app/models/customer.interface';
import { stableSort } from '@app/utils';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

const genCustomerData = (
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  points: number,
  ranking: RankType,
  _id: string,
  gender?: CustomerGender,
) => ({
  firstName,
  lastName,
  phone,
  email,
  points,
  ranking,
  _id,
  gender: gender || CustomerGender.NA,
});

const rows = [
  genCustomerData(
    'Luat',
    'Dang',
    '0982292922',
    'abc@gmail.com',
    1000,
    RankType.DIAMOND,
    '1',
    CustomerGender.MALE,
  ),
  genCustomerData(
    'Bach',
    'Xuan',
    '0982292922',
    'abc@gmail.com',
    1000,
    RankType.GOLD,
    '2',
    CustomerGender.FEMALE,
  ),
  genCustomerData(
    'Luat',
    'Dang',
    '0982292922',
    'abc@gmail.com',
    1000,
    RankType.DIAMOND,
    '3',
  ),
  genCustomerData(
    'Luat',
    'Dang',
    '0982292922',
    'abc@gmail.com',
    1000,
    RankType.PLATINUM,
    '4',
  ),
  genCustomerData(
    'Chang',
    'Dang',
    '0982292922',
    'abc@gmail.com',
    1000,
    RankType.SILVER,
    '5',
  ),
];

function CustomersScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customersSelector = useSelector(selectCustomers);
  const { customers, loading } = customersSelector;

  useEffect(() => {
    dispatch(fetchCustomers());
  }, []);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      {' '}
      <Helmet>
        <title>Customers</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(4) }}>
        <Typography variant="h4" color={theme.palette.secondary.contrastText}>
          Customers
        </Typography>{' '}
      </Box>
      <Box sx={{ marginBottom: theme.spacing(2) }}>{/* <FilterBox /> */}</Box>
      <DataCustomersTable
        rows={customers}
        stableSort={stableSort}
        isLoading={loading}
      />
    </Box>
  );
}

export default CustomersScreen;
