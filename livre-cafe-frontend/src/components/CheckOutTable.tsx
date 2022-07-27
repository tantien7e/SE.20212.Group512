import EditReservationModal from '@app/components/EditReservationModal';
import {
  CartAction,
  CartItemInterface,
  CartStateInterface,
  Store,
} from '@app/context/Store';
import { ReservationPostData } from '@app/models/reservation.interface';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EditCartModal from './EditCartModal';

interface CartRowInterface {
  _id?: string;
  imageUrl?: string;
  productId?: string;
  productName?: string;
  cost?: number;
  stock?: number;
  author?: string;
  quantity?: number;
  additionalRequirements: string;
  type?: string;
  id?: number;
  price?: number;
  name?: string;
}

export default function CheckOutTable() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openEditReservation, setOpenEditReservation] = useState(false);
  const [currentItem, setCurrentItem] = useState<CartItemInterface>();
  const [rows, setRows] = useState<CartRowInterface[]>([]);
  const [currentReservation, setCurrentReservation] =
    useState<ReservationPostData>();

  const handleDelete = (params: GridRenderCellParams<any, any, any>) => {
    const toBeDeleted = params.row;
    if (toBeDeleted?.type === 'Reservation') {
      dispatch({ type: CartAction.REMOVE_RESERVATION });
    } else
      dispatch({
        type: CartAction.DELETE_ITEM,
        payload: toBeDeleted,
      });
  };

  const deleteButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button
          variant="text"
          color="error"
          onClick={(e) => handleDelete(params)}
        >
          <DeleteOutlineOutlinedIcon />
        </Button>
      </strong>
    );
  };

  const editButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button variant="outlined" onClick={(e) => handleEdit(params)}>
          Edit
        </Button>
      </strong>
    );
  };

  const handleEdit = (params: GridRenderCellParams<any, any, any>) => {
    const quantity = params.row.quantity;
    const additionalRequirements = params.row.additionalRequirements;
    if (params.row.type === 'Reservation') {
      setOpenEditReservation(true);
      setCurrentReservation(state.reservation);
    } else {
      setOpenEditModal(true);
      setCurrentItem(params.row);
    }
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 140, sortable: false },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'name', headerName: 'Item Name', width: 200 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 140,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 140,
      renderCell: (params) => <>${params.row.cost}</>,
    },
    {
      field: 'additionalRequirements',
      headerName: 'Additional Requirements',
      sortable: false,
      flex: 1
    },
    {
      field: 'edit',
      headerName: 'Edit',
      renderCell: (params) => editButton(params),
      width: 140,
    },
    {
      field: 'delete',
      headerName: 'Delete',
      renderCell: (params) => deleteButton(params),
      width: 140,
    },
  ];

  const renderCartRows = (cartState: CartStateInterface) => {
    const reservation = cartState.reservation;
    const cartReservation = {
      id: 1,
      _id: cartState.reservation?.area._id,
      type: 'Reservation',
      name: reservation?.area.name,
      quantity: reservation?.duration,
      cost: reservation
        ? reservation?.duration * reservation?.area?.costPerHour
        : 0,
      additionalRequirements: reservation?.additionalRequirements
        ? reservation?.additionalRequirements
        : 'None',
    };
    const cartItems = cartState.cart.cartItems.map((item, id) => {
      const type = item.title ? 'Book' : 'Drink';
      const name = item.title || item.name;
      const quantity = item.quantity;

      return {
        id: !!reservation ? id + 2 : id + 1,
        _id: item._id,
        type,
        name: name,
        price: item.price,
        quantity,
        cost: quantity * item.price,
        additionalRequirements: item.additionalRequirements
          ? item.additionalRequirements
          : 'None',
        stock: item.stock,
      };
    });

    return reservation ? [cartReservation, ...cartItems] : cartItems;
  };

  useEffect(() => {
    const newRows = renderCartRows(state);
    setRows(newRows);
  }, [state]);

  return (
    <div
      style={{
        height: 620,
        width: '100%',
        backgroundColor: 'white',
      }}
    >
      {currentItem && openEditModal && (
        <EditCartModal
          open={openEditModal}
          handleClose={() => {
            setOpenEditModal(false);
          }}
          item={currentItem}
        />
      )}
      {currentReservation && openEditReservation && (
        <EditReservationModal
          open={openEditReservation}
          handleClose={() => {
            setOpenEditReservation(false);
          }}
          reservation={currentReservation}
        />
      )}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        isRowSelectable={() => false}
        rowHeight={75}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        // autoHeight={true}
        headerHeight={80}
        density={"comfortable"}
        sx={{
          padding: '1rem',
          paddingTop: '0',
          '& .MuiDataGrid-main > div:first-child': {
            zIndex: rows.length === 0 ? 100 : 0,
          },
        }}
        components={{
          NoRowsOverlay: () => <NoRowsComponent />,
        }}
      />
    </div>
  );
}

const NoRowsComponent = () => {
  const navigate = useNavigate();
  return (
    <Box width={'100%'} height="100%" zIndex={5}>
      <Grid
        container
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        rowGap={2}
      >
        <Grid item>
          <Typography variant="body1">Cart is empty </Typography>
        </Grid>
        <Grid item>
          <Button variant="text" onClick={() => navigate('/inventory')}>
            <Typography variant="body1"> Add Some</Typography>
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
