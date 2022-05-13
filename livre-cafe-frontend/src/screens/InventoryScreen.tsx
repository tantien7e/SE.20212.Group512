import { Box, Divider, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CoffeeIcon from '@mui/icons-material/Coffee';
import DataTable from '@app/components/DataTable';
import { useTheme } from '@mui/material/styles';
import { Helmet } from 'react-helmet-async';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function InventoryScreen() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const theme = useTheme();
  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      <Helmet>
        <title>Inventory</title>
      </Helmet>
      <Box sx={{ marginBottom: '1rem' }}>
        <Typography variant="h4" color={theme.palette.secondary.contrastText}>
          Inventory
        </Typography>{' '}
      </Box>
      {/* <Divider /> */}
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider', width: 'fit-content' }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            iconPosition="start"
            icon={<CoffeeIcon />}
            label="Drinks"
            {...a11yProps(0)}
          />
          <Tab
            iconPosition="start"
            icon={<MenuBookIcon />}
            label="Books"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DataTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Books here
      </TabPanel>
    </Box>
  );
}

export default InventoryScreen;
