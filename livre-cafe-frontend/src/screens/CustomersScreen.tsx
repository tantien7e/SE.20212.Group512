import {
  deleteCustomer,
  fetchCustomers,
  selectCustomers,
} from '@app/app/features/customers/customers-slice';
import AddCustomerModal from '@app/components/AddCustomerModal';
import DataTable, { HeadCell } from '@app/components/DataTable';
import DeleteConfirmModal from '@app/components/DeleteConfirmModal';
import EditCustomerModal from '@app/components/EditCustomerModal';
import ViewCustomerModal from '@app/components/ViewCustomerModal';
import { ModalType } from '@app/constants';
import requireAuthentication from '@app/hocs/requireAuthentication';
import { BookInterface, DrinkInterface } from '@app/models';
import { AllModel } from '@app/models/common';
import {
  CUSTOMER,
  CustomerGender,
  CustomerInterface,
  RankIndex,
  RankType,
} from '@app/models/customer.interface';
import {
  a11yProps,
  getRankColor,
  getSalutation,
  numberWithCommas,
  stableSort,
} from '@app/utils';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  Box,
  Chip,
  IconButton,
  Tab,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

const headCells: HeadCell<CustomerInterface>[] = [
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
    id: 'rankingPoints',
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

function CustomersScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customersSelector = useSelector(selectCustomers);
  const { customers, loading } = customersSelector;
  console.log(customers)
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [deleteCustomerModalOpen, setDeleteCustomerModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<CustomerInterface>();
  const [tabIndex, setTabIndex] = useState(0);

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
  const tabs = () => {
    return [
      <Tab label="All" {...a11yProps(0)} />,
      <Tab label="Diamond" {...a11yProps(RankIndex.DIAMOND)} />,
      <Tab label="PLATINUM" {...a11yProps(RankIndex.PLATINUM)} />,
      <Tab label="GOLD" {...a11yProps(RankIndex.GOLD)} />,
      <Tab label="SILVER" {...a11yProps(RankIndex.SILVER)} />,
    ];
  };
  const dataRow = (row: CustomerInterface, index: number) => {
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
        key={`customer${row?._id}` + index}
      // selected={isItemSelected}
      >
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          {`${getSalutation(row.gender)} `}
          <strong>{`${row.firstName}`}</strong>
          {` ${row.lastName}`}
        </TableCell>
        <TableCell align="left">{row.phone}</TableCell>
        <TableCell align="left">{row.email}</TableCell>
        <TableCell align="right">
          {numberWithCommas(row.rankingPoints)}
        </TableCell>
        <TableCell align="left">
          <Chip
            label={
              <Typography
                variant="body2"
                fontWeight={600}
                textTransform="uppercase"
              >
                {row.ranking}
              </Typography>
            }
            variant="filled"
            color={getRankColor(row.ranking)}
          />
        </TableCell>

        <TableCell align="right" sx={{ minWidth: 200 }} width="220px">
          <IconButton
            color="primary"
            onClick={() => handleOpenModal(ModalType.VIEW_CUSTOMER, row)}
            sx={{ marginRight: 2 }}
          >
            <PreviewIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal(ModalType.EDIT_CUSTOMER, row)}
            sx={{ marginRight: 2 }}
            color="info"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenModal(ModalType.DELETE_CUSTOMER, row)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (!customers) return;
    const rows = customers || ([] as CustomerInterface[]);
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
    return newRows;
  };

  const handleDeleteCustomer = (
    confirmText: string,
    setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setDeleteSuccess(false);
    if (!currentCustomer) return;
    if (currentCustomer?.firstName !== confirmText) {
      setDeleteError(true);
      return;
    }
    dispatch(deleteCustomer(currentCustomer._id));
    setDeleteSuccess(true);
  };

  useEffect(() => {
    if (!customers) dispatch(fetchCustomers());
  }, [customers]);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      {deleteCustomerModalOpen && (
        <DeleteConfirmModal
          open={deleteCustomerModalOpen}
          handleClose={() => handleCloseModal(ModalType.DELETE_CUSTOMER)}
          item={{ name: currentCustomer?.firstName || '' }}
          handleDelete={handleDeleteCustomer}
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
      )}{' '}
      <Helmet>
        <title>Customers</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(4) }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={theme.palette.secondary.contrastText}
        >
          Customers
        </Typography>{' '}
      </Box>
      <Box sx={{ marginBottom: theme.spacing(2) }}>{/* <FilterBox /> */}</Box>
      <DataTable
        rows={customers || []}
        stableSort={stableSort}
        isLoading={loading}
        headCells={headCells}
        dataRow={dataRow}
        handleOpenAddModal={() => handleOpenModal(ModalType.ADD_CUSTOMER)}
        handleChangeTab={handleChangeTab}
        searchTarget={(row: CustomerInterface) => {
          const { firstName, lastName } = row;
          return firstName + lastName;
        }}
        defaultOrderBy="firstName"
        tabs={() => tabs()}
        tabIndex={tabIndex}
        name={'Customers'}
      />
    </Box>
  );
}

export default requireAuthentication(CustomersScreen);
