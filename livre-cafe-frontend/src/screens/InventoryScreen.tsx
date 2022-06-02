import DataBooksTable from '@app/components/DataBooksTable';
import DataDrinksTable from '@app/components/DataDrinksTable';
import { useFetchDrinksQuery } from '@app/app/services/drinks/drinks-api-slice';
import useFetchBooks from '@app/hooks/useFetchBooks';
import { BookInterface, DrinkInterface } from '@app/types/product.interface';
import { stableSort } from '@app/utils';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function createDrinksData(
  name: string,
  stock: number,
  price: number,
  imageUrl: string,
  _id: string,
): DrinkInterface {
  return {
    imageUrl,
    stock,
    name,
    price,
    _id,
  };
}

function createBooksData(
  title: string,
  stock: number,
  price: number,
  _id: string,
  author: string,
  country: string,
  imageLink: string,
  language: string,
  link: string,
  pages: number,
  year: number,
): BookInterface {
  return {
    stock,
    title,
    price,
    author,
    _id,
    year,
    pages,
    link,
    language,
    imageLink,
    country,
  };
}

const drinks = [
  createDrinksData(
    'Bac xiu',
    5,
    3.7,
    'https://cdn.tgdd.vn/2021/03/CookProduct/Bac-xiu-la-gi-nguon-goc-va-cach-lam-bac-xiu-thom-ngon-don-gian-tai-nha-0-1200x676.jpg',
    '1',
  ),
  createDrinksData('Donut', 10, 25.0, 'url', '2'),
  createDrinksData('Eclair', 2, 16.0, 'url', '3'),
  createDrinksData('Frozen yoghurt', 4, 6.0, 'url', '4'),
  createDrinksData('Gingerbread', 20, 16.0, 'url', '5'),
  createDrinksData('Honeycomb', 100, 3.2, 'url', '6'),
  createDrinksData('Ice cream sandwich', 105, 9.0, 'url', '7'),
  createDrinksData('Jelly Bean', 10, 0.0, 'url', '8'),
  createDrinksData('KitKat', 2, 26.0, 'url', '9'),
  createDrinksData('Lollipop', 3, 0.2, 'url', '10'),
  createDrinksData('Marshmallow', 5, 0, 'url', '11'),
  createDrinksData('Nougat', 1, 19.0, 'url', '12'),
  createDrinksData('Oreo', 0, 18.0, 'url', '13'),
];

// const books = [
//   createBooksData('Cupcake', 5, 3.7, 'url', '1', 'James',),
//   createBooksData('Donut', 10, 25.0, 'url', '2', 'Hank'),
//   createBooksData('Eclair', 2, 16.0, 'url', '3', 'John'),
//   createBooksData('Frozen yoghurt', 4, 6.0, 'url', '4', 'Andy Dang'),
//   createBooksData('Gingerbread', 20, 16.0, 'url', '5', 'Mark'),
//   createBooksData('Honeycomb', 100, 3.2, 'url', '6', 'Hi Mark'),
//   createBooksData('Ice cream sandwich', 105, 9.0, 'url', '7', 'NTT'),
//   createBooksData('Jelly Bean', 10, 0.0, 'url', '8', 'NXB'),
//   createBooksData('KitKat', 2, 26.0, 'url', '9', 'Hay lam'),
//   createBooksData('Lollipop', 3, 0.2, 'url', '10', 'Kay James'),
//   createBooksData('Marshmallow', 5, 0, 'url', '11', 'Dang James'),
//   createBooksData('Nougat', 1, 19.0, 'url', '12', 'Liu James'),
//   createBooksData('Oreo', 0, 18.0, 'url', '13', 'Laspers James'),
// ];

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
  const {
    data: drinksData,
    error: drinksError,
    isLoading: isDrinksLoading,
  } = useFetchDrinksQuery();
  const [books, setBooks] = useState<BookInterface[]>([]);
  const theme = useTheme();
  const fetchBooks = async (url: string) => {
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
    if (drinksError) {
      toast.error('Something happened!');
    }
    console.log(drinksData);
  }, [drinksError, drinksData]);

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
          isLoading={isDrinksLoading}
          rows={drinksData || []}
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
