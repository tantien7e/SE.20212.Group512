import { Store } from '@app/context/Store';
import { OrderInterface, ProductInterface } from '@app/models';
import { CustomerInterface } from '@app/models/customer.interface';
import { StaffResponse } from '@app/models/user.interface';
import { Search } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput,
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

type Data =
  | CustomerInterface
  | ProductInterface
  | OrderInterface
  | StaffResponse;

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

export interface HeadCell<T> {
  disablePadding: boolean;
  id: keyof Omit<T, 'orders'>;
  label: string;
  numeric: boolean;
  isNotOrderable?: boolean;
  width?: number | string;
}

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
  headCells: HeadCell<Data>[];
}

function EnhancedTableHead(props: EnhancedTableHeadProps) {
  const {
    order,
    orderBy,
    onRequestSort,
    onSearchChange,
    filterText,
    headCells,
  } = props;
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
            width={headCell?.width ? headCell.width : ''}
          >
            {!headCell.isNotOrderable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <>{headCell.label}</>
            )}
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
  handleOpenAddModal?: () => void;
  name: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { handleOpenAddModal, name } = props;

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
            {name}
          </Typography>

          <Tooltip title="New Customer">
            <Button
              endIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                handleOpenAddModal && handleOpenAddModal();
              }}
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
  headCells: HeadCell<any>[];
  dataRow: (row: any, index: number) => JSX.Element;
  handleOpenAddModal?: () => void;
  handleChangeTab?: (event: React.SyntheticEvent, newValue: number) => any;
  searchTarget: (row: any) => string;
  defaultOrderBy: string;
  tabs?: () => JSX.Element[];
  tabIndex?: number;
  name: string;
}

export default function DataTable(props: EnhancedTableProps) {
  const {
    rows,
    stableSort,
    isLoading,
    headCells,
    dataRow,
    handleOpenAddModal,
    handleChangeTab,
    searchTarget,
    defaultOrderBy,
    tabs,
    tabIndex,
    name,
  } = props;
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<
    keyof Omit<Data, 'actions' | 'orders'>
  >(defaultOrderBy as any);
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState<Data[]>(rows);

  const theme = useTheme();

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
      return searchTarget(row).toLowerCase().includes(text);
    });
    setFilteredRows(newRows);
  };

  const { state, dispatch } = useContext(Store);

  useEffect(() => {
    if (rows && handleChangeTab) {
      const tabRows = handleChangeTab(1 as any, tabIndex || 0);
      const newRows = tabRows?.filter((row: any) => {
        return searchTarget(row).toLowerCase().includes(filterText);
      });
      setFilteredRows(newRows);
    }
  }, [rows, tabIndex]);

  return (
    <Box sx={{ width: '100%' }}>
      {tabs && (
        <Grid>
          <Box sx={{ borderColor: 'divider', width: 'auto', marginBottom: 2 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, val) =>
                handleChangeTab && setFilteredRows(handleChangeTab(e, val))
              }
              aria-label="basic tabs example"
            >
              {tabs().map((tab) => tab)}
            </Tabs>
          </Box>
        </Grid>
      )}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleOpenAddModal={handleOpenAddModal}
          name={name}
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
              headCells={headCells}
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
                {stableSort(
                  filteredRows,
                  getComparator(
                    order,
                    orderBy as Exclude<keyof Data, 'ordersHistory' | '_id'>,
                  ),
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, index) => {
                    return dataRow(row, index);
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
          count={filteredRows?.length}
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
