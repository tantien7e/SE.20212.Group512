import React, { useContext } from 'react';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { CartItemInterface, Store } from '@app/context/Store';
import { relative } from 'node:path/win32';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Button, Grid, Typography } from '@mui/material';
import { idID } from '@mui/material/locale';
import { parseClassName } from 'react-toastify/dist/utils';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';
import { Params, useNavigate } from 'react-router-dom';
import EditCartModal from './EditCartModal';
import {
  BookInterface,
  DrinkInterface,
  ProductInterface,
} from '@app/models/product.interface';
import { useState } from 'react';
import { current } from '@reduxjs/toolkit';

interface CartRowInterface {
  _id: string;
  imageUrl: string;
  productId: string;
  productName: string;
  cost: number;
  stock: number;
  author?: string;
  quantity: number;
  additionalRequirement: string;
}

export default function CheckOutTable() {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<CartItemInterface>();

  const handleDelete = (params: GridRenderCellParams<any, any, any>) => {
    const toBeDeleted = params.row;
    dispatch({
      type: 'DELETE_ITEM',
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
    const additionalRequirement = params.row.additionalRequirement;
    setCurrentItem(params.row);
    setOpenEditModal(true);
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 70, sortable: false },
    { field: 'type', headerName: 'Type', width: 140 },
    { field: 'name', headerName: 'Item', width: 140 },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 100,
    },
    {
      field: 'cost',
      headerName: 'Cost',
      width: 100,
      renderCell: (params) => <>${params.row.cost}</>,
    },
    {
      field: 'additionalRequirement',
      headerName: 'Additional Requirements',
      sortable: false,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      renderCell: (params) => editButton(params),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      renderCell: (params) => deleteButton(params),
    },
  ];
  const rows = cart.cartItems.map((item, id) => {
    const type = item.title ? 'Book' : 'Drink';
    const name = item.title || item.name;
    const quantity = item.quantity;

    return {
      id: id + 1,
      _id: item._id,
      type,
      name: name,
      price: item.price,
      quantity,
      cost: quantity * item.price,
      additionalRequirement: item.additionalRequirement
        ? item.additionalRequirement
        : 'None',
      stock: item.stock,
    };
  });

  return (
    <div
      style={{
        height: 400,
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
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        isRowSelectable={() => false}
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
