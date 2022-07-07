import AddItemModal from '@app/components/AddItemModal';
import AddToCartModal from '@app/components/AddToCartModal';
import DeleteConfirmModal from '@app/components/DeleteConfirmModal';
import EditInventoryModal from '@app/components/EditInventoryModal';
import { InventoryType, ModalType } from '@app/constants';
import { Store } from '@app/context/Store';
import { CustomerInterface } from '@app/models';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { numberWithCommasRound2 } from '@app/utils';
import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import {
  Avatar,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from '@mui/material';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import React, { useContext, useEffect, useState } from 'react';

interface Data extends DrinkInterface {}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Exclude<Key, 'actions'>,
): (
  a: { [key in Exclude<Key, 'actions'>]: number | string },
  b: { [key in Exclude<Key, 'actions'>]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
// function stableSort<T>(
//   array: readonly T[],
//   comparator: (a: Omit<T, 'actions'>, b: Omit<T, 'actions'>) => number,
// ) {
//   const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'stock',
    numeric: true,
    disablePadding: false,
    label: 'Stock',
  },
  {
    id: 'price',
    numeric: true,
    disablePadding: false,
    label: 'Price',
  },
];

interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void;
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  onSearchChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void;
  filterText: string;
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const { order, orderBy, onRequestSort, onSearchChange, filterText } = props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell
          key="picture"
          align="left"
          padding="normal"
          // sortDirection={orderBy === headCell.id ? order : false}
        >
          Picture
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell
          key="search-bar"
          align="right"
          padding="normal"
          // sortDirection={orderBy === headCell.id ? order : false}
        >
          <Box component="form" noValidate autoComplete="off">
            <FormControl>
              <OutlinedInput
                startAdornment={
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                }
                placeholder="Search by name"
                onChange={onSearchChange}
                value={filterText}
              />
            </FormControl>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleOpenModal: (type: ModalType, item?: DrinkInterface) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleOpenModal } = props;
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : null;
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        Drinks
      </Typography>

      {user?.isManager && (
        <Tooltip title="New Product">
          <Button
            endIcon={<AddIcon />}
            variant="contained"
            onClick={() => handleOpenModal(ModalType.ADD_PRODUCT)}
          >
            Add
          </Button>
        </Tooltip>
      )}
    </Toolbar>
  );
};

interface EnhancedTableProps {
  rows: Data[];
  stableSort: (
    array: readonly Data[],
    comparator: (a: Data, b: Data) => number,
  ) => Data[];
  isLoading?: boolean;
}

export default function EnhancedTable(props: EnhancedTableProps) {
  const { rows, stableSort, isLoading } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof Exclude<Data, 'actions'>>('name');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState<Data[]>(rows);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [deleteProductModalOpen, setDeleteProductModalOpen] = useState(false);

  const [addToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [currentCartItem, setCurrentCartItem] = useState<DrinkInterface>();
  const theme = useTheme();
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : null;

  const handleOpenModal = (type: ModalType, item?: DrinkInterface) => {
    switch (type) {
      case ModalType.ADD_TO_CART:
        setAddToCartModalOpen(true);
        setCurrentCartItem(item);
        break;
      case ModalType.EDIT_INVENTORY:
        setEditModalOpen(true);
        setCurrentCartItem(item);
        break;
      case ModalType.ADD_PRODUCT:
        setAddProductModalOpen(true);
        setCurrentCartItem(undefined);
        break;
      case ModalType.DELETE_PRODUCT:
        setDeleteProductModalOpen(true);
        setCurrentCartItem(item);
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
    setCurrentCartItem(undefined);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleSearch = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const text = e.target.value.toLowerCase();
    setFilterText(text);
    const newRows = rows.filter((row) => {
      const { name } = row;
      return name.toLowerCase().includes(text);
    });
    setFilteredRows(newRows);
  };

  const { state, dispatch } = useContext(Store);
  // console.log(state);

  useEffect(() => {
    if (rows) {
      const newRows = rows.filter((row) => {
        const { name } = row;
        return name.toLowerCase().includes(filterText);
      });
      setFilteredRows(newRows);
    }
  }, [rows]);

  return (
    <Box sx={{ width: '100%' }}>
      {deleteProductModalOpen && (
        <DeleteConfirmModal
          open={deleteProductModalOpen}
          handleClose={() => handleCloseModal(ModalType.DELETE_PRODUCT)}
          item={
            currentCartItem as DrinkInterface &
              BookInterface &
              CustomerInterface
          }
          type={InventoryType.DRINK}
        />
      )}
      {addProductModalOpen && (
        <AddItemModal
          open={addProductModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_PRODUCT)}
          type={InventoryType.DRINK}
        />
      )}

      {editModalOpen && currentCartItem && (
        <EditInventoryModal
          open={editModalOpen}
          handleClose={() => handleCloseModal(ModalType.EDIT_INVENTORY)}
          item={currentCartItem as DrinkInterface & BookInterface}
          type={InventoryType.DRINK}
        />
      )}

      {addToCartModalOpen && currentCartItem && (
        <AddToCartModal
          open={addToCartModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_TO_CART)}
          item={currentCartItem as DrinkInterface & BookInterface}
        />
      )}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleOpenModal={handleOpenModal}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 688 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              onSearchChange={handleSearch}
              filterText={filterText}
            />
            {isLoading ? (
              <div
                style={{
                  //   width: '100%',
                  height: '280px',
                  display: 'table-row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  margin: 'auto',
                }}
              >
                <td colSpan={100} style={{ verticalAlign: 'middle' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </td>
              </div>
            ) : (
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
              rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(filteredRows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
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
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell align="right">{row.stock}</TableCell>
                        <TableCell align="right">
                          ${numberWithCommasRound2(row.price)}
                        </TableCell>
                        <TableCell align="right" width={280}>
                          <Button
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            onClick={() => {
                              // handleAddToCart(row);
                              handleOpenModal(ModalType.ADD_TO_CART, row);
                            }}
                          >
                            Add To Cart
                          </Button>
                          {user?.isManager && (
                            <Button
                              variant="outlined"
                              onClick={() =>
                                handleOpenModal(ModalType.EDIT_INVENTORY, row)
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
                                handleOpenModal(ModalType.DELETE_PRODUCT, row)
                              }
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (dense ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}
