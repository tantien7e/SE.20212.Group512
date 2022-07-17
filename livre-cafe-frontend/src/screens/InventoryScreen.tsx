import { fetchBooks, selectBooks } from '@app/app/features/books/books-slice';
import {
  fetchDrinks,
  selectDrinks,
} from '@app/app/features/drinks/drinks-slice';
import {
  deleteSnack,
  fetchSnacks,
  selectSnacks,
} from '@app/app/features/snacks/snacks-slice';
import DataBooksTable from '@app/components/DataBooksTable';
import DataDrinksTable from '@app/components/DataDrinksTable';
import DataTable, { HeadCell } from '@app/components/DataTable';
import requireAuthentication from '@app/hocs/requireAuthentication';
import { ProductInterface, SnackInterface } from '@app/models';
import { numberWithCommasRound2, stableSort } from '@app/utils';
import CoffeeIcon from '@mui/icons-material/Coffee';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TapasIcon from '@mui/icons-material/Tapas';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Avatar,
  Box,
  BoxProps,
  Button,
  IconButton,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { InventoryType, ModalType } from '@app/constants';
import DeleteConfirmModal from '@app/components/DeleteConfirmModal';
import AddItemModal from '@app/components/AddItemModal';
import EditInventoryModal from '@app/components/EditInventoryModal';
import { AllModel } from '@app/models/common';
import AddToCartModal from '@app/components/AddToCartModal';
interface TabPanelProps extends BoxProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...boxProps } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ paddingTop: 3 }} {...boxProps}>
          {children}
        </Box>
      )}
    </div>
  );
}

export function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const snacksHeadCells: HeadCell<SnackInterface>[] = [
  {
    id: 'imageUrl',
    numeric: false,
    disablePadding: false,
    label: 'Picture',
  },
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
];

function InventoryScreen() {
  const [value, setValue] = useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const dispatch = useDispatch();
  const drinksSelector = useSelector(selectDrinks);
  const booksSelector = useSelector(selectBooks);
  const snacksSelector = useSelector(selectSnacks);
  const { drinks, loading: drinksLoading } = drinksSelector;
  const { books, loading: booksLoading } = booksSelector;
  // const { snacks, loading: snacksLoading } = snacksSelector;
  const snacks = [
    {
      _id: '1',
      name: 'Crab Chua',
      price: 100,
      imageUrl:
        'https://pasgo.vn/Upload/anh-chi-tiet/nha-hang-queens-crab-crab-seafood-restaurant-hoang-dao-thuy-2-normal-543004715592.jpg',
    },
  ];
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);
  const [addToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [currentSnackItem, setCurrentSnackItem] = useState<SnackInterface>();
  const theme = useTheme();
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : null;

  const handleOpenSnackModal = (type: ModalType, item?: SnackInterface) => {
    switch (type) {
      case ModalType.ADD_TO_CART:
        setAddToCartModalOpen(true);
        setCurrentSnackItem(item);
        break;
      case ModalType.EDIT_INVENTORY:
        setEditModalOpen(true);
        setCurrentSnackItem(item);
        break;
      case ModalType.ADD_PRODUCT:
        setAddProductModalOpen(true);
        setCurrentSnackItem(undefined);
        break;
      case ModalType.DELETE_PRODUCT:
        setDeleteProductModalOpen(true);
        setCurrentSnackItem(item);
        break;
      default:
        return;
    }
  };
  const handleCloseModal = (type: ModalType) => {
    switch (type) {
      case ModalType.ADD_TO_CART:
        setAddToCartModalOpen(false);
        break;
      case ModalType.EDIT_INVENTORY:
        setEditModalOpen(false);
        break;
      case ModalType.ADD_PRODUCT:
        setAddProductModalOpen(false);
        break;
      case ModalType.DELETE_PRODUCT:
        setDeleteProductModalOpen(false);
        break;
      default:
        return;
    }
    setCurrentSnackItem(undefined);
  };
  const dataSnackRow = (row: SnackInterface, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    return (
      <TableRow
        hover
        // onClick={(event) =>
        //   handleClick(event, row.name as string)
        // }
        role="checkbox"
        // aria-checked={isItemSelected}
        tabIndex={-1}
        key={row._id + index}
        // selected={isItemSelected}
      >
        <TableCell align="left">
          <Avatar
            alt={row.name}
            // sx={{ margin }}
            variant="rounded"
            src={row.imageUrl}
          ></Avatar>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.name}
        </TableCell>
        <TableCell align="right">
          ${numberWithCommasRound2(row.price)}
        </TableCell>
        <TableCell align="right" width={280}>
          <Button
            variant="contained"
            sx={{ marginRight: 2 }}
            onClick={() => {
              // handleAddToCart(row);
              handleOpenSnackModal(ModalType.ADD_TO_CART, row);
            }}
          >
            Add To Cart
          </Button>
          {user?.isManager && (
            <Button
              variant="outlined"
              onClick={() =>
                handleOpenSnackModal(ModalType.EDIT_INVENTORY, row)
              }
              sx={{ marginRight: 2 }}
            >
              Edit
            </Button>
          )}
          {user?.isManager && (
            <IconButton
              color="error"
              onClick={() =>
                handleOpenSnackModal(ModalType.DELETE_PRODUCT, row)
              }
            >
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const handleDeleteSnack = (
    confirmText: string,
    setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setDeleteSuccess(false);
    if (!currentSnackItem) return;
    if (currentSnackItem?.name !== confirmText) {
      setDeleteError(true);
      return;
    }
    dispatch(deleteSnack(currentSnackItem._id));
    setDeleteSuccess(true);
  };

  useEffect(() => {
    if (!drinks) {
      dispatch(fetchDrinks());
    }
    if (!books) {
      dispatch(fetchBooks());
    }
    if (!snacks) {
      dispatch(fetchSnacks());
    }
  }, [dispatch, drinks, books]);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      {deleteProductModalOpen && (
        <DeleteConfirmModal
          open={deleteProductModalOpen}
          handleClose={() => handleCloseModal(ModalType.DELETE_PRODUCT)}
          item={{ name: currentSnackItem?.name || '' }}
          handleDelete={handleDeleteSnack}
        />
      )}
      {addProductModalOpen && (
        <AddItemModal
          open={addProductModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_PRODUCT)}
          type={InventoryType.SNACK}
        />
      )}

      {editModalOpen && currentSnackItem && (
        <EditInventoryModal
          open={editModalOpen}
          handleClose={() => handleCloseModal(ModalType.EDIT_INVENTORY)}
          item={currentSnackItem as ProductInterface}
          type={InventoryType.SNACK}
        />
      )}

      {addToCartModalOpen && currentSnackItem && (
        <AddToCartModal
          open={addToCartModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_TO_CART)}
          item={currentSnackItem as ProductInterface}
          hasNoStock
        />
      )}
      <Helmet>
        <title>Inventory</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(2) }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={theme.palette.secondary.contrastText}
        >
          Inventory
        </Typography>{' '}
      </Box>
      {/* <Divider /> */}
      <Box sx={{ borderColor: 'divider', width: 'fit-content' }}>
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
          <Tab
            iconPosition="start"
            icon={<TapasIcon />}
            label="Snacks"
            {...a11yProps(2)}
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
      <TabPanel value={value} index={2}>
        <DataTable
          isLoading={booksLoading}
          rows={snacks || []}
          headCells={snacksHeadCells}
          stableSort={stableSort}
          searchTarget={(row: SnackInterface) => {
            const { name } = row;
            return name;
          }}
          defaultOrderBy="name"
          name="Snacks"
          handleOpenAddModal={() => handleOpenSnackModal(ModalType.ADD_PRODUCT)}
          dataRow={dataSnackRow}
        />
      </TabPanel>
    </Box>
  );
}

export default requireAuthentication(InventoryScreen);
