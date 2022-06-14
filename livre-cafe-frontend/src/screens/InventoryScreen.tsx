import { fetchBooks, selectBooks } from '@app/app/features/books/books-slice';
import {
  fetchDrinks,
  selectDrinks,
} from '@app/app/features/drinks/drinks-slice';
import DataBooksTable from '@app/components/DataBooksTable';
import DataDrinksTable from '@app/components/DataDrinksTable';
import useFetchBooks from '@app/hooks/useFetchBooks';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { stableSort } from '@app/utils';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

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
  const dispatch = useDispatch();
  const drinksSelector = useSelector(selectDrinks);
  const booksSelector = useSelector(selectBooks);
  const { drinks, loading: drinksLoading } = drinksSelector;
  const { books, loading: booksLoading } = booksSelector;
  const theme = useTheme();

  useEffect(() => {
    dispatch(fetchDrinks());
    dispatch(fetchBooks());
  }, [dispatch]);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      <Helmet>
        <title>Inventory</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(2) }}>
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
        <DataDrinksTable
          isLoading={drinksLoading}
          rows={drinks || []}
          stableSort={stableSort}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataBooksTable
          isLoading={booksLoading}
          rows={books || []}
          stableSort={stableSort}
        />
      </TabPanel>
    </Box>
  );
}

export default InventoryScreen;
