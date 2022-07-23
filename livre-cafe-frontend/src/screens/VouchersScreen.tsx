import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { } from '@mui/x-data-grid/themeAugmentation';
import {
  Box,
  Button,
  Container,
  createTheme,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import VouchersTable from '@app/components/VouchersTable';
import AddIcon from '@mui/icons-material/Add';
import DiamondIcon from '@mui/icons-material/Diamond';
import requireAuthentication from '@app/hocs/requireAuthentication';
import { useFetch } from '@app/hooks/useFetch';
import { a11yProps } from './InventoryScreen';
import AddVoucherModal from '@app/components/AddVoucherModal';

function VouchersScreen() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <div className="screen-container">
      <Helmet>
        <title>Vouchers Management</title>
      </Helmet>
      <div>
        {openAddModal && <AddVoucherModal
          open={openAddModal}
          handleClose={() => {
            setOpenAddModal(false);
          }}
        />}
      </div>
      <Box sx={{ marginBottom: theme.spacing(5) }}>
        <Box sx={{ marginBottom: theme.spacing(3.5) }}>
          <Typography
            variant="h5"
            fontWeight={600}
            color={theme.palette.secondary.contrastText}
          >
            Vouchers
          </Typography>{' '}
        </Box>
        <Box sx={{ borderColor: 'divider', width: 'fit-content' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              iconPosition="start"
              // icon={<CoffeeIcon />}
              label="All"
              {...a11yProps(0)}
            />
            <Tab
              iconPosition="start"
              // icon={<TapasIcon />}
              label="Silver"
              {...a11yProps(4)}
            />
            <Tab
              iconPosition="start"
              // icon={<TapasIcon />}
              label="Gold"
              {...a11yProps(3)}
            />
            <Tab iconPosition="start" label="Platinum" {...a11yProps(1)} />
            <Tab
              iconPosition="start"
              icon={<DiamondIcon />}
              label="Diamond"
              {...a11yProps(2)}
            />
          </Tabs>
        </Box>
        <Box display="flex" justifyContent="flex-end" alignItems="flex-end">
          <Button
            endIcon={<AddIcon />}
            variant="contained"
            onClick={() => {
              setOpenAddModal(true)
            }}
          >
            Add
          </Button>
        </Box>
        <Box sx={{ margin: `${theme.spacing(2)} 0` }}>
          <VouchersTable />
        </Box>
      </Box>
    </div >
  );
}

export default requireAuthentication(VouchersScreen);
