import { updateOrder } from '@app/app/features/orders/orders-slice';
import ConfirmModal from '@app/components/ConfirmModal';
import ViewOrderModal from '@app/components/ViewOrderModal';
import { ModalType, OrderTabIndex } from '@app/constants';
import { OrderInterface, OrderPostData, OrderStatusType } from '@app/models';
import {
  a11yProps, numberWithCommasRound2
} from '@app/utils';
import { Search } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Tab,
  Tabs,
  Tooltip
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
import Typography from '@mui/material/Typography';
import { visuallyHidden } from '@mui/utils';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface Data extends OrderInterface {
  totalCost: number;
}

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

type OrderBy<T> = Exclude<T, 'actions' | 'orders'>;

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: OrderBy<Key>,
): (
  a: { [key in OrderBy<Key>]: number | string },
  b: { [key in OrderBy<Key>]: number | string },
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
    id: 'id',
    numeric: false,
    disablePadding: false,
    label: 'Order ID',
  },
  {
    id: 'customer',
    numeric: false,
    disablePadding: false,
    label: 'Customer',
  },
  {
    id: 'itemsOrdered',
    numeric: false,
    disablePadding: false,
    label: 'Items',
  },
  {
    id: 'bookedAt',
    disablePadding: false,
    label: 'Booked At',
    numeric: false,
  },
  {
    id: 'status',
    disablePadding: false,
    label: 'Status',
    numeric: false,
  },
  {
    id: 'totalCost',
    disablePadding: false,
    label: 'Total Cost',
    numeric: true,
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
            <Tooltip title="Search by item's name, customer name or Order Id">
              <FormControl>
                <OutlinedInput
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                  placeholder="Search by item's name, customer name, order Id"
                  onChange={onSearchChange}
                  value={filterText}
                />
              </FormControl>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleOpenModal: (type: ModalType, item?: OrderInterface) => void;
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
            Orders
          </Typography>
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

export default function OrdersTable(props: EnhancedTableProps) {
  const { rows, stableSort, isLoading } = props;
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] =
    React.useState<keyof Omit<Data, 'actions' | 'orders'>>('bookedAt');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [filterText, setFilterText] = useState('');
  const [filteredRows, setFilteredRows] = useState<Data[]>(rows);
  const [confirmCompleteModalOpen, setConfirmCompleteModalOpen] =
    useState(false);
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderInterface>();
  const theme = useTheme();
  const [tabIndex, setTabIndex] = React.useState(0);
  const dispatch = useDispatch();

  const handleOpenModal = (type: ModalType, item?: OrderInterface) => {
    switch (type) {
      case ModalType.VIEW_ORDER:
        setViewModalOpen(true);
        setCurrentOrder(item);
        break;
      case ModalType.CONFIRM_COMPLETE_ORDER:
        setConfirmCompleteModalOpen(true);
        setCurrentOrder(item);
        break;
      case ModalType.CONFIRM_CANCEL_ORDER:
        setConfirmCancelModalOpen(true);
        setCurrentOrder(item);
        break;
      default:
        return;
    }
  };
  const handleCloseModal = (type: ModalType) => {
    switch (type) {
      case ModalType.VIEW_ORDER:
        setViewModalOpen(false);
        setCurrentOrder(undefined);
        break;
      case ModalType.CONFIRM_COMPLETE_ORDER:
        setConfirmCompleteModalOpen(false);
        setCurrentOrder(undefined);
        break;
      case ModalType.CONFIRM_CANCEL_ORDER:
        setConfirmCancelModalOpen(false);
        setCurrentOrder(undefined);
        break;
      default:
        return;
    }
    setCurrentOrder(undefined);
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
    const textTokens = text.split(' ');
    setFilterText(text);
    const newRows = rows.filter((row) => {
      const { customer, id, _id, itemsOrdered } = row;
      const itemsName = itemsOrdered.reduce(
        (a, c) => a + (c.product.name || c.product.title),
        '',
      );
      const idText = id || _id || '';
      const name = !customer ? 'Guest' : customer.firstName + customer.lastName;
      const hasConflict = textTokens.find(
        (token) =>
          !(
            name.toLowerCase().includes(token) ||
            itemsName.toLowerCase().includes(token) ||
            String(idText).toLowerCase().includes(token)
          ),
      );

      return !hasConflict;
    });
    setFilteredRows(newRows);
  };
  const convertToOrderPostItems = (
    orderItem: OrderInterface,
  ): OrderPostData => {
    return {
      ...orderItem,
      customer: orderItem.customer?._id || null,
      itemsOrdered: orderItem.itemsOrdered.map((item) => {
        return { ...item, product: item.product._id };
      }),
    };
  };
  const handleCompleteOrder = () => {
    if (!currentOrder) return;
    const orderPostData = convertToOrderPostItems(currentOrder);
    dispatch(
      updateOrder({ ...orderPostData, status: OrderStatusType.COMPLETED }),
    );
  };

  const handleCancerOrder = () => {
    if (!currentOrder) return;
    const orderPostData = convertToOrderPostItems(currentOrder);
    dispatch(
      updateOrder({ ...orderPostData, status: OrderStatusType.CANCELLED }),
    );
  };

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    let newRows;
    switch (newValue) {
      case OrderTabIndex.COMPLETED:
        newRows = rows.filter(
          (row) => row.status === OrderStatusType.COMPLETED,
        );
        break;
      case OrderTabIndex.PROCESSING:
        newRows = rows.filter(
          (row) => row.status === OrderStatusType.PROCESSING,
        );
        break;

      case OrderTabIndex.CANCELLED:
        newRows = rows.filter(
          (row) => row.status === OrderStatusType.CANCELLED,
        );
        break;
      default:
        newRows = rows.slice();
    }
    setFilteredRows(newRows);
    return newRows;
  };

  useEffect(() => {
    if (rows) {
      const tabRows = handleChangeTab(1 as any, tabIndex);
      const text = filterText.toLowerCase();
      const textTokens = text.split(' ');
      const newRows = tabRows.filter((row) => {
        const { customer, id, _id, itemsOrdered } = row;
        const itemsName = itemsOrdered.reduce(
          (a, c) => a + (c.product.name || c.product.title),
          '',
        );
        const idText = id || _id || '';
        const name = !customer
          ? 'Guest'
          : customer.firstName + customer.lastName;
        const hasConflict = textTokens.find(
          (token) =>
            !(
              name.toLowerCase().includes(token) ||
              itemsName.toLowerCase().includes(token) ||
              String(idText).toLowerCase().includes(token)
            ),
        );

        return !hasConflict;
      });
      setFilteredRows(newRows);
    }
  }, [rows, tabIndex]);

  return (
    <Box sx={{ width: '100%' }}>
      {confirmCompleteModalOpen && currentOrder && (
        <ConfirmModal
          open={confirmCompleteModalOpen}
          handleClose={() => handleCloseModal(ModalType.CONFIRM_COMPLETE_ORDER)}
          handleConfirm={handleCompleteOrder}
          title={`Do you want to mark order #${
            currentOrder.id || currentOrder._id
          } as COMPLETED`}
        />
      )}

      {confirmCancelModalOpen && currentOrder && (
        <ConfirmModal
          open={confirmCancelModalOpen}
          title={`Do you want to cancel order #${
            currentOrder.id || currentOrder._id
          }`}
          handleClose={() => handleCloseModal(ModalType.CONFIRM_CANCEL_ORDER)}
          handleConfirm={handleCancerOrder}
        />
      )}

      {viewModalOpen && currentOrder && (
        <ViewOrderModal
          open={viewModalOpen}
          handleClose={() => handleCloseModal(ModalType.VIEW_ORDER)}
          currentOrder={currentOrder}
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
            <Tab label="COMPLETED" {...a11yProps(OrderTabIndex.COMPLETED)} />
            <Tab label="PROCESSING" {...a11yProps(OrderTabIndex.PROCESSING)} />
            <Tab label="CANCELLED" {...a11yProps(OrderTabIndex.CANCELLED)} />
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
                {stableSort(
                  filteredRows,
                  getComparator(
                    order,
                    orderBy as keyof Data & { itemsOrdered: string | number },
                  ),
                )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const { customer } = row;
                    const customerName = !customer
                      ? 'Guest'
                      : customer.firstName + ' ' + customer.lastName;
                    return (
                      <TableRow
                        hover
                        // onClick={(event) =>
                        //   handleClick(event, row.name as string)
                        // }
                        role="checkbox"
                        // aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={`customer${row?._id}` + index}
                        // selected={isItemSelected}
                      >
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="normal"
                          align="left"
                          width={100}
                        >
                          <Tooltip title={row._id || ''}>
                            <Typography
                              overflow="hidden"
                              textOverflow="ellipsis"
                              width={100}
                              whiteSpace="nowrap"
                            >{`${row._id} `}</Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell align="left">{customerName}</TableCell>
                        <TableCell align="left">
                          {row.itemsOrdered.reduce(
                            (a, c, cIndex) =>
                              a +
                              (c.product.title || c.product.name) +
                              (cIndex < row.itemsOrdered.length - 1
                                ? ', '
                                : '.'),
                            '',
                          )}
                        </TableCell>
                        <TableCell align="left">
                          {moment(row.bookedAt).format('DD.MM.YYYY')}
                        </TableCell>
                        <TableCell align="left">
                          <OrderStatusBadge status={row.status} />
                        </TableCell>
                        <TableCell align="right">
                          ${numberWithCommasRound2(row.totalCost)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ minWidth: 200 }}
                          width="220px"
                        >
                          {row.status !== OrderStatusType.COMPLETED &&
                            row.status !== OrderStatusType.CANCELLED && (
                              <Tooltip title="Mark As Completed">
                                <IconButton
                                  color="success"
                                  onClick={() =>
                                    handleOpenModal(
                                      ModalType.CONFIRM_COMPLETE_ORDER,
                                      row,
                                    )
                                  }
                                  sx={{ marginRight: 2 }}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          {row.status !== OrderStatusType.CANCELLED &&
                            row.status !== OrderStatusType.COMPLETED && (
                              <Tooltip title="Cancel order">
                                <IconButton
                                  onClick={() =>
                                    handleOpenModal(
                                      ModalType.CONFIRM_CANCEL_ORDER,
                                      row,
                                    )
                                  }
                                  sx={{ marginRight: 2 }}
                                  color="error"
                                >
                                  <DoNotDisturbAltIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          <Tooltip title="View Details">
                            <IconButton
                              color="info"
                              onClick={() =>
                                handleOpenModal(ModalType.VIEW_ORDER, row)
                              }
                              sx={{ marginRight: 2 }}
                            >
                              <PreviewIcon />
                            </IconButton>
                          </Tooltip>
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

interface OrderStatusBadgeProps {
  status: OrderStatusType;
}

export function OrderStatusBadge(props: OrderStatusBadgeProps) {
  const theme = useTheme();
  const themeBlock = theme.block;
  const { status } = props;
  switch (status) {
    case OrderStatusType.PROCESSING:
      return (
        <Box
          minWidth={100}
          sx={{
            backgroundColor: themeBlock?.pending.backgroundColor,
            borderRadius: theme.spacing(1),
          }}
          p={1}
          textAlign="center"
        >
          <Typography
            fontWeight={600}
            color={themeBlock?.pending.fontColor}
            textTransform="uppercase"
          >
            {OrderStatusType.PROCESSING}
          </Typography>
        </Box>
      );
    case OrderStatusType.COMPLETED:
      return (
        <Box
          minWidth={100}
          sx={{
            backgroundColor: themeBlock?.completed.backgroundColor,
            borderRadius: theme.spacing(1),
          }}
          p={1}
          textAlign="center"
        >
          <Typography
            fontWeight={600}
            color={themeBlock?.completed.fontColor}
            textTransform="uppercase"
          >
            {OrderStatusType.COMPLETED}
          </Typography>
        </Box>
      );
    case OrderStatusType.CANCELLED:
      return (
        <Box
          minWidth={100}
          sx={{
            backgroundColor: themeBlock?.cancelled.backgroundColor,
            borderRadius: theme.spacing(1),
          }}
          textAlign="center"
          p={1}
        >
          <Typography
            fontWeight={600}
            color={themeBlock?.cancelled.fontColor}
            textTransform="uppercase"
          >
            {OrderStatusType.CANCELLED}
          </Typography>
        </Box>
      );
    default:
      return <>Invalid Status</>;
  }
}
