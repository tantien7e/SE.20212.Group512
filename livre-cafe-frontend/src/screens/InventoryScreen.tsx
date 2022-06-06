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
  const { drinks, loading: drinksLoading } = drinksSelector;
  const [books, setBooks] = useState<BookInterface[]>([]);
  const theme = useTheme();
  const fetchBooks = async (url: string) => {
    drinksLoading;
    const response = await fetch(url);
    const booksData = await response.json();
    const generatedBooks = booksData.map(
      (book: Exclude<BookInterface, '_id'>, index: number) => ({
        ...book,
        _id: String(index),
        price: (Math.random() * 100).toPrecision(2),
        stock: Math.round(Math.random() * 100),
      }),
    );
    setBooks(generatedBooks);
  };
  const bookUrl =
    'https://raw.githubusercontent.com/benoitvallon/100-best-books/master/books.json';
  const { data, isLoading, error } = useFetchBooks(bookUrl);

  useEffect(() => {
    dispatch(fetchDrinks());
  }, [dispatch]);

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
        <DataDrinksTable
          isLoading={drinksLoading}
          rows={drinks || []}
          stableSort={stableSort}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataBooksTable
          isLoading={isLoading}
          rows={data}
          stableSort={stableSort}
        />
      </TabPanel>
    </Box>
  );
}

export default InventoryScreen;
