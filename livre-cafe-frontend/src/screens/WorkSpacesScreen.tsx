import {
  fetchReservations,
  selectReservations,
  updateReservation
} from '@app/app/features/reservations/reservations-slice';

import DataTable, { HeadCell } from '@app/components/DataTable';
import Floor from '@app/components/Floor/Floor';
import { ModalType } from '@app/constants';
import requireAuthentication from '@app/hocs/requireAuthentication';
import {
  CustomerInterface,
  ReservationInterface,
  ReservationStatus,
  ReservationStatusIndex
} from '@app/models';
import { TabPanel } from '@app/screens/InventoryScreen';
import { a11yProps, stableSort } from '@app/utils';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WeekendIcon from '@mui/icons-material/Weekend';
import {
  IconButton,
  Tab,
  TableCell,
  TableRow,
  Tabs,
  Tooltip,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';

const headCells: HeadCell<
  ReservationInterface & {
    date: Date;
    time: string;
    customer: CustomerInterface;
  }
>[] = [
  {
    id: '_id',
    numeric: false,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'area',
    numeric: false,
    disablePadding: false,
    label: 'Area',
  },
  {
    id: 'customer',
    numeric: false,
    disablePadding: false,
    label: 'Customer',
  },
  {
    id: 'startTime',
    numeric: false,
    disablePadding: false,
    label: 'Date',
  },
  {
    id: 'startTime',
    numeric: false,
    disablePadding: false,
    label: 'Time',
  },

  {
    id: 'duration',
    numeric: true,
    disablePadding: false,
    label: 'Duration',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
];

function WorkSpacesScreen() {
  const theme = useTheme();
  const dispatch = useDispatch();
  // const customersSelector = useSelector(selectreservations);
  // const { customers, loading } = customersSelector;
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [deleteStaffModalOpen, setDeleteStaffModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<ReservationInterface>();
  const [tabIndex, setTabIndex] = useState(0);
  const [generalTabInex, setGeneralTabIndex] = useState(0);
  const reservationsSelector = useSelector(selectReservations);
  const { reservations, loading, updateLoading } = reservationsSelector;

  const handleChangeGeneralTab = (
    _event: React.SyntheticEvent,
    newValue: number,
  ) => {
    setGeneralTabIndex(newValue);
  };
  const handleOpenModal = (type: ModalType, item?: ReservationInterface) => {
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

  const handleUpdateReservationStatus = (
    status: ReservationStatus,
    reservation: ReservationInterface,
  ) => {
    if (!reservation || reservation.status === ReservationStatus.PENDING)
      return;
    dispatch(
      updateReservation({
        ...reservation,
        status,
      }),
    );
  };
  const tabs = () => {
    return [
      <Tab label="All" {...a11yProps(0)} />,
      <Tab label="Pending" {...a11yProps(ReservationStatusIndex.PENDING)} />,
      <Tab
        label="Confirmed"
        {...a11yProps(ReservationStatusIndex.CONFIRMED)}
      />,
      <Tab
        label="COMPLETED"
        {...a11yProps(ReservationStatusIndex.COMPLETED)}
      />,
      <Tab label="SEATED" {...a11yProps(ReservationStatusIndex.SEATED)} />,
      <Tab
        label="CANCELLED"
        {...a11yProps(ReservationStatusIndex.CANCELLED)}
      />,
    ];
  };
  const dataRow = (row: ReservationInterface, index: number) => {
    const labelId = `enhanced-table-checkbox-${index}`;
    const { order } = row;
    const customerName = !order?.customer
      ? 'Guest'
      : order?.customer.firstName + ' ' + order?.customer.lastName || '';
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
        <TableCell align="left">{row.area?.name}</TableCell>
        <TableCell align="left">{customerName}</TableCell>
        <TableCell align="left">
          {moment(row.startTime).format('DD.MM.YYYY')}
        </TableCell>
        <TableCell align="left">
          {moment(row.startTime).format('hh:mm A')}
        </TableCell>
        <TableCell align="right">{row.duration}</TableCell>
        <TableCell align="left">
          <ReservationStatusBadge status={row.status} />
        </TableCell>
        <TableCell align="right" sx={{ minWidth: 200 }} width="220px">
          {row.status !== ReservationStatus.PENDING &&
            row.status === ReservationStatus.CONFIRMED && (
              <Tooltip title="Mark as Seated">
                <IconButton
                  color="info"
                  onClick={() =>
                    handleUpdateReservationStatus(ReservationStatus.SEATED, row)
                  }
                >
                  <WeekendIcon />
                </IconButton>
              </Tooltip>
            )}
          {row.status !== ReservationStatus.CANCELLED &&
            row.status !== ReservationStatus.COMPLETED &&
            row.status !== ReservationStatus.PENDING && (
              <>
                {
                  <Tooltip title="Mark as Completed">
                    <IconButton
                      color="success"
                      onClick={() =>
                        handleUpdateReservationStatus(
                          ReservationStatus.COMPLETED,
                          row,
                        )
                      }
                    >
                      <DoneAllIcon />
                    </IconButton>
                  </Tooltip>
                }
                <Tooltip title="Mark as Cancelled">
                  <IconButton
                    color="error"
                    onClick={() =>
                      handleUpdateReservationStatus(
                        ReservationStatus.CANCELLED,
                        row,
                      )
                    }
                  >
                    <DoDisturbIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
        </TableCell>
      </TableRow>
    );
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    if (!reservations) return;
    const rows = reservations || ([] as ReservationInterface[]);
    let newRows;
    switch (newValue) {
      case ReservationStatusIndex.PENDING:
        newRows = rows.filter(
          (row) => row.status === ReservationStatus.PENDING,
        );
        break;
      case ReservationStatusIndex.CONFIRMED:
        newRows = rows.filter(
          (row) => row.status === ReservationStatus.CONFIRMED,
        );
        break;
      case ReservationStatusIndex.COMPLETED:
        newRows = rows.filter(
          (row) => row.status === ReservationStatus.COMPLETED,
        );
        break;
      case ReservationStatusIndex.SEATED:
        newRows = rows.filter((row) => row.status === ReservationStatus.SEATED);
        break;
      case ReservationStatusIndex.CANCELLED:
        newRows = rows.filter(
          (row) => row.status === ReservationStatus.CANCELLED,
        );
        break;
      default:
        newRows = rows.slice();
    }
    return newRows;
  };

  useEffect(() => {
    if (!reservations && !loading) {
      dispatch(fetchReservations());
    }
  }, [reservations, loading]);

  return (
    <Box
      sx={{ maxWidth: '100%' }}
      className="screen-container inventory-screen-container"
    >
      <Helmet>
        <title>Work Spaces</title>
      </Helmet>
      {/* <Box sx={{ marginBottom: theme.spacing(4) }}>
        <Typography
          variant="h5"
          fontWeight={600}
          color={theme.palette.secondary.contrastText}
        >
          Work Spaces
        </Typography>{' '}
      </Box> */}
      <Box sx={{ marginBottom: theme.spacing(2) }}>{/* <FilterBox /> */}</Box>
      <Box sx={{ borderColor: 'divider', width: 'fit-content' }}>
        <Tabs
          value={generalTabInex}
          onChange={handleChangeGeneralTab}
          aria-label="basic tabs example"
          variant="fullWidth"
        >
          <Tab
            iconPosition="start"
            // icon={<CoffeeIcon />}
            label="Reservations"
            {...a11yProps(0)}
          />
          <Tab
            iconPosition="start"
            // icon={<MenuBookIcon />}
            label="Work Spaces"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={generalTabInex} index={0}>
        <DataTable
          rows={reservations || []}
          stableSort={stableSort}
          isLoading={loading}
          headCells={headCells}
          dataRow={dataRow}
          handleOpenAddModal={() => handleOpenModal(ModalType.ADD_STAFF)}
          handleChangeTab={handleChangeTab}
          searchTarget={(row: ReservationInterface) => {
            const { order, area } = row;
            const firstName = order?.customer?.firstName || '';
            const lastName = order?.customer?.lastName || '';
            return firstName + lastName + area?.name;
          }}
          defaultOrderBy="startTime"
          tabs={() => tabs()}
          tabIndex={tabIndex}
          name="Reservations"
        />
      </TabPanel>
      <TabPanel value={generalTabInex} index={1}>
        <Floor />
      </TabPanel>
    </Box>
  );
}

export default requireAuthentication(WorkSpacesScreen);

interface ReservationStatusBadgeProps {
  status: ReservationStatus;
}
export function ReservationStatusBadge(props: ReservationStatusBadgeProps) {
  const theme = useTheme();
  const themeBlock = theme.block;
  const { status } = props;
  switch (status) {
    case ReservationStatus.PENDING:
      return (
        <Box
          minWidth={100}
          maxWidth={200}
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
            {ReservationStatus.PENDING}
          </Typography>
        </Box>
      );
    case ReservationStatus.SEATED:
      return (
        <Box
          minWidth={100}
          maxWidth={200}
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
            {ReservationStatus.SEATED}
          </Typography>
        </Box>
      );
    case ReservationStatus.CONFIRMED:
      return (
        <Box
          minWidth={100}
          maxWidth={200}
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
            {ReservationStatus.CONFIRMED}
          </Typography>
        </Box>
      );
    case ReservationStatus.COMPLETED:
      return (
        <Box
          minWidth={100}
          maxWidth={200}
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
            {ReservationStatus.COMPLETED}
          </Typography>
        </Box>
      );
    case ReservationStatus.CANCELLED:
      return (
        <Box
          minWidth={100}
          maxWidth={200}
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
            {ReservationStatus.CANCELLED}
          </Typography>
        </Box>
      );
    default:
      return <>Invalid Status</>;
  }
}
