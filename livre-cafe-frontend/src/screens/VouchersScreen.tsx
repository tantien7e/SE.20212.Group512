import React from 'react';
import { Helmet } from 'react-helmet-async';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { Box, createTheme, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VouchersTable from '@app/components/VouchersTable';
import requireAuthentication from '@app/hocs/requireAuthentication';
import { useFetch } from '@app/hooks/useFetch';

function VouchersScreen() {
  const theme = useTheme();

  return (
    <div className="screen-container">
      <Helmet>
        <title>Vouchers Management</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(5) }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={theme.palette.secondary.contrastText}
        >
          Vouchers
        </Typography>{' '}
        <Box sx={{ margin: `${theme.spacing(2)} 0` }}>
          <VouchersTable />
        </Box>
      </Box>
    </div>
  );
}

export default requireAuthentication(VouchersScreen);
