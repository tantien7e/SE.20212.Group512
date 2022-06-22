import AddCustomerModal from '@app/components/AddCustomerModal';
import DeleteConfirmModal from '@app/components/DeleteConfirmModal';
import EditCustomerModal from '@app/components/EditCustomerModal';
import ViewCustomerModal from '@app/components/ViewCustomerModal';
import { ModalType } from '@app/constants';
import { Store } from '@app/context/Store';
import {
  CUSTOMER,
  CustomerGender,
  CustomerInterface,
  RankIndex,
  RankType,
} from '@app/models/customer.interface';
import { BookInterface, DrinkInterface } from '@app/models/product.interface';
import { a11yProps, getSalutation } from '@app/utils';
import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tab,
  Tabs,
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

interface Data extends CustomerInterface {}

type ExcludedKey = 'action' | 'orders';

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
  orderBy: Exclude<Key, 'actions' | 'orders'>,
): (
  a: { [key in Exclude<Key, 'actions' | 'orders'>]: number | string },
  b: { [key in Exclude<Key, 'actions' | 'orders'>]: number | string },
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
  id: keyof Omit<Data, 'orders'>;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'firstName',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'phone',
    numeric: false,
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'Email',
  },
  {
    id: 'points',
    disablePadding: false,
    label: 'Points',
    numeric: true,
  },
  {
    id: 'ranking',
    disablePadding: false,
    label: 'Ranking',
    numeric: false,
  },
];

interface EnhancedTableHeadProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Omit<Data, 'orders'>,
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
    (property: keyof Omit<Data, 'orders'>) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
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
  handleOpenModal: (type: ModalType, item?: CustomerInterface) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleOpenModal } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 2, sm: 2 },
      }}
    >
      <Grid container direction="column">
        <Grid item container justifyContent="space-between" sx={{ pt: 2 }}>
          <Typography variant="h6" id="tableTitle" component="div">
            Customers
          </Typography>

          <Tooltip title="New Customer">
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() => handleOpenModal(ModalType.ADD_CUSTOMER)}
            >
              Add
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
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

export default function DataCustomersTable(props: EnhancedTableProps) {
  const { rows, stableSort, isLoading } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof Omit<Data, 'actions' | 'orders'>>('firstName');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState<Data[]>(rows);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [deleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface>();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    let newRows;
    switch (newValue) {
      case RankIndex.DIAMOND:
        newRows = rows.filter((row) => row.ranking === RankType.DIAMOND);
        break;
      case RankIndex.PLATINUM:
        newRows = rows.filter((row) => row.ranking === RankType.PLATINUM);
        break;
      case RankIndex.GOLD:
        newRows = rows.filter((row) => row.ranking === RankType.GOLD);
        break;
      case RankIndex.SILVER:
        newRows = rows.filter((row) => row.ranking === RankType.SILVER);
        break;
      default:
        newRows = rows.slice();
    }
    setFilteredRows(newRows);
  };

  const handleOpenModal = (type: ModalType, item?: CustomerInterface) => {
    switch (type) {
      case ModalType.DELETE_CUSTOMER:
        setDeleteCustomerModalOpen(true);
        setCurrentCustomer(item);
        break;
      case ModalType.ADD_CUSTOMER:
        setAddCustomerModalOpen(true);
        break;
      case ModalType.EDIT_CUSTOMER:
        setEditModalOpen(true);
        setCurrentCustomer(item);
        break;
      case ModalType.VIEW_CUSTOMER:
        setViewModalOpen(true);
        setCurrentCustomer(item);
        break;
      default:
        return;
    }
  };
  const handleCloseModal = (type: ModalType) => {
    switch (type) {
      case ModalType.EDIT_CUSTOMER:
        setEditModalOpen(false);
        break;
      case ModalType.ADD_CUSTOMER:
        setAddCustomerModalOpen(false);
        break;
      case ModalType.DELETE_CUSTOMER:
        setDeleteCustomerModalOpen(false);
        break;
      case ModalType.VIEW_CUSTOMER:
        setViewModalOpen(false);
        break;
      default:
        return;
    }
    setCurrentCustomer(undefined);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Omit<Data, 'orders'>,
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
      const { firstName, lastName } = row;
      const name = firstName + lastName;
      return name.toLowerCase().includes(text);
    });
    setFilteredRows(newRows);
  };

  const { state, dispatch } = useContext(Store);

  

  const getRankColor = (rank: RankType) => {
    switch (rank) {
      case RankType.DIAMOND:
        return 'info';
      case RankType.PLATINUM:
        return 'success';
      case RankType.GOLD:
        return 'warning';
      case RankType.SILVER:
        return 'default';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    if (rows) {
      const newRows = rows.filter((row) => {
        const { firstName, lastName } = row;
        const name = firstName + lastName;
        return name.toLowerCase().includes(filterText);
      });
      setFilteredRows(newRows);
    }
  }, [rows]);

  return (
    <Box sx={{ width: '100%' }}>
      {deleteCustomerModalOpen && (
        <DeleteConfirmModal
          open={deleteCustomerModalOpen}
          handleClose={() => handleCloseModal(ModalType.DELETE_CUSTOMER)}
          item={
            currentCustomer as DrinkInterface &
              BookInterface &
              CustomerInterface
          }
          type={CUSTOMER}
        />
      )}
      {addCustomerModalOpen && (
        <AddCustomerModal
          open={addCustomerModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_CUSTOMER)}
          type={CUSTOMER}
        />
      )}

      {editModalOpen && currentCustomer && (
        <EditCustomerModal
          open={editModalOpen}
          handleClose={() => handleCloseModal(ModalType.EDIT_CUSTOMER)}
          item={currentCustomer}
          type={CUSTOMER}
        />
      )}

      {viewModalOpen && currentCustomer && (
        <ViewCustomerModal
          open={viewModalOpen}
          handleClose={() => handleCloseModal(ModalType.VIEW_CUSTOMER)}
          item={currentCustomer}
          type={CUSTOMER}
        />
      )}
      <Grid>
        <Box sx={{ borderColor: 'divider', width: 'auto', marginBottom: 2 }}>
          <Tabs
            value={tabIndex}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
          >
            <Tab label="All" {...a11yProps(0)} />
            <Tab label="Diamond" {...a11yProps(RankIndex.DIAMOND)} />
            <Tab label="PLATINUM" {...a11yProps(RankIndex.PLATINUM)} />
            <Tab label="GOLD" {...a11yProps(RankIndex.GOLD)} />
            <Tab label="SILVER" {...a11yProps(RankIndex.SILVER)} />
          </Tabs>
        </Box>
      </Grid>
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
                        key={`customer${row?.id}` + index}
                        // selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                        >
                          {`${getSalutation(row.gender)} `}
                          <strong>{`${row.firstName}`}</strong>
                          {` ${row.lastName}`}
                        </TableCell>
                        <TableCell align="left">{row.phone}</TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="right">{row.points}</TableCell>
                        <TableCell align="left">
                          <Chip
                            label={
                              <Typography variant="body2" fontWeight={600}>
                                {row.ranking}
                              </Typography>
                            }
                            variant="filled"
                            color={getRankColor(row.ranking)}
                          />
                        </TableCell>

                        <TableCell align="right" width={280}>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleOpenModal(ModalType.VIEW_CUSTOMER, row)
                            }
                            sx={{ marginRight: 2 }}
                          >
                            <PreviewIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleOpenModal(ModalType.EDIT_CUSTOMER, row)
                            }
                            sx={{ marginRight: 2 }}
                            color="info"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleOpenModal(ModalType.DELETE_CUSTOMER, row)
                            }
                          >
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
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
