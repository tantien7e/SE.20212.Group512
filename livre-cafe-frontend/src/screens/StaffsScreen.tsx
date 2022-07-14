import AddStaffModal from '@app/components/AddStaffModal';
import DataTable, { HeadCell } from '@app/components/DataTable';
import DeleteConfirmModal from '@app/components/DeleteConfirmModal';
import EditStaffModal from '@app/components/EditStaffModal';
import ViewStaffModal from '@app/components/ViewStaffModal';
import { ModalType } from '@app/constants';
import requireAuthentication from '@app/hocs/requireAuthentication';
import {
  StaffResponse,
  UserRole,
  UserRoleIndex,
} from '@app/models/user.interface';
import { a11yProps, stableSort } from '@app/utils';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import {
  Avatar,
  IconButton,
  Tab,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch } from 'react-redux';

const headCells: HeadCell<StaffResponse>[] = [
  {
    id: 'imageUrl',
    numeric: false,
    disablePadding: false,
    label: 'Picture',
    isNotOrderable: true,
    width: 100,
  },
  {
    id: 'username',
    numeric: false,
    disablePadding: false,
    label: 'Name',
  },
  {
    id: 'passcode',
    numeric: false,
    disablePadding: false,
    label: 'Phone',
  },
  {
    id: 'isManager',
    numeric: false,
    disablePadding: false,
    label: 'Role',
  },
];
const staffs: StaffResponse[] = [
  {
    _id: '1',
    username: 'staff1',
    isManager: false,
    passcode: '9999',
    phone: '0982222222',
    firstName: 'Luat',
    lastName: 'Dang',
  },
];

function StaffsScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  // const customersSelector = useSelector(selectStaffs);
  // const { customers, loading } = customersSelector;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [deleteStaffModalOpen, setDeleteStaffModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<StaffResponse>();
  const [tabIndex, setTabIndex] = useState(0);
  const handleOpenModal = (type: ModalType, item?: StaffResponse) => {
    switch (type) {
      case ModalType.DELETE_STAFF:
        setDeleteStaffModalOpen(true);
        setCurrentStaff(item);
        break;
      case ModalType.ADD_STAFF:
        setAddStaffModalOpen(true);
        break;
      case ModalType.EDIT_STAFF:
        setEditModalOpen(true);
        setCurrentStaff(item);
        break;
      case ModalType.VIEW_STAFF:
        setViewModalOpen(true);
        setCurrentStaff(item);
        break;
      default:
        return;
    }
  };

  const handleCloseModal = (type: ModalType) => {
    switch (type) {
      case ModalType.EDIT_STAFF:
        setEditModalOpen(false);
        break;
      case ModalType.ADD_STAFF:
        setAddStaffModalOpen(false);
        break;
      case ModalType.DELETE_STAFF:
        setDeleteStaffModalOpen(false);
        break;
      case ModalType.VIEW_STAFF:
        setViewModalOpen(false);
        break;
      default:
        return;
    }
    setCurrentStaff(undefined);
  };
  const tabs = () => {
    return [
      <Tab label="All" {...a11yProps(0)} />,
      <Tab label="Manager" {...a11yProps(UserRoleIndex.MANAGER)} />,
      <Tab label="Staff" {...a11yProps(UserRoleIndex.STAFF)} />,
    ];
  };
  const dataRow = (row: StaffResponse, index: number) => {
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
        <TableCell align="left">
          <Avatar
            alt={row.username}
            // sx={{ margin }}
            variant="rounded"
            src={row.imageUrl}
          ></Avatar>
        </TableCell>
        <TableCell component="th" id={labelId} scope="row" padding="normal">
          <strong>{`${row.firstName}`}</strong> {row.lastName || ''}
        </TableCell>
        <TableCell align="left">{row.phone}</TableCell>
        <TableCell align="left">
          {row.isManager ? UserRole.MANAGER : UserRole.STAFF}
        </TableCell>

        <TableCell align="right" sx={{ minWidth: 200 }} width="220px">
          <IconButton
            color="primary"
            onClick={() => handleOpenModal(ModalType.VIEW_STAFF, row)}
            sx={{ marginRight: 2 }}
          >
            <PreviewIcon />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal(ModalType.EDIT_STAFF, row)}
            sx={{ marginRight: 2 }}
            color="info"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleOpenModal(ModalType.DELETE_STAFF, row)}
          >
            <DeleteOutlineOutlinedIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    );
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (!staffs) return;
    const rows = staffs || ([] as StaffResponse[]);
    let newRows;
    switch (newValue) {
      case UserRoleIndex.MANAGER:
        newRows = rows.filter((row) => row.isManager);
        break;
      case UserRoleIndex.STAFF:
        newRows = rows.filter((row) => !row.isManager);
        break;
      default:
        newRows = rows.slice();
    }
    return newRows;
  };

  const handleDeleteStaff = (
    confirmText: string,
    setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setDeleteSuccess(false);
    if (!currentStaff) return;
    if (currentStaff?.username !== confirmText) {
      setDeleteError(true);
      return;
    }
    // dispatch(deleteBook(currentBookItem._id));
    setDeleteSuccess(true);
  };

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      {deleteStaffModalOpen && currentStaff && (
        <DeleteConfirmModal
          open={deleteStaffModalOpen}
          handleClose={() => handleCloseModal(ModalType.DELETE_STAFF)}
          item={{ name: currentStaff.username }}
          handleDelete={handleDeleteStaff}
        />
      )}
      {addStaffModalOpen && (
        <AddStaffModal
          open={addStaffModalOpen}
          handleClose={() => handleCloseModal(ModalType.ADD_STAFF)}
        />
      )}
      {editModalOpen && currentStaff && (
        <EditStaffModal
          open={editModalOpen}
          handleClose={() => handleCloseModal(ModalType.EDIT_STAFF)}
          item={currentStaff}
        />
      )}
      {viewModalOpen && currentStaff && (
        <ViewStaffModal
          open={viewModalOpen}
          handleClose={() => handleCloseModal(ModalType.VIEW_STAFF)}
          item={currentStaff}
        />
      )}
      <Helmet>
        <title>Staffs</title>
      </Helmet>
      <Box sx={{ marginBottom: theme.spacing(4) }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={theme.palette.secondary.contrastText}
        >
          Staffs
        </Typography>{' '}
      </Box>
      <Box sx={{ marginBottom: theme.spacing(2) }}>{/* <FilterBox /> */}</Box>
      <DataTable
        rows={staffs || []}
        stableSort={stableSort}
        isLoading={false}
        headCells={headCells}
        dataRow={dataRow}
        handleOpenAddModal={() => handleOpenModal(ModalType.ADD_STAFF)}
        handleChangeTab={handleChangeTab}
        searchTarget={(row: StaffResponse) => {
          const { username, phone } = row;
          return username + phone;
        }}
        defaultOrderBy="firstName"
        tabs={() => tabs()}
        tabIndex={tabIndex}
        name="Staffs"
      />
    </Box>
  );
}

export default requireAuthentication(StaffsScreen);
