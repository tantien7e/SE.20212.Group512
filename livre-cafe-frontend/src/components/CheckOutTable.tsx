import React, { useContext } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Store } from '@app/context/Store';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'type', headerName: 'Type', width: 140 },
  { field: 'item', headerName: 'Item', width: 140 },
  {
    field: 'quantity',
    headerName: 'Quantity',
    // type: 'number',
    width: 140,
  },
  {
    field: 'cost',
    headerName: 'Cost',
    width: 140,
  },
  {
    field: 'additionalRequirements',
    headerName: 'Additional Requirements',
    sortable: false,
    width: 300,
  },
];

export default function CheckOutTable() {
  const { state, dispatch } = useContext(Store);
  // console.log(state);
  const { cart } = state;
  const rows = cart.cartItems.map((item, id) => {
    const type = item.title ? 'Book' : 'Drink';
    const name = item.title || item.name;
    const quantity = item.quantity;
    return {
      id: id + 1,
      type,
      item: name,
      quantity,
      cost: '$' + quantity * item.price,
      additionalRequirements: 'None',
    };
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
