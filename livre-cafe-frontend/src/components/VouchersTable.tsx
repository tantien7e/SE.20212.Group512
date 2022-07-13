import React from 'react';
import {
  DataGrid,
  GridColDef,
  GridColumns,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { Helmet } from 'react-helmet-async';
import type {} from '@mui/x-data-grid/themeAugmentation';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import { useFetch } from '@app/hooks/useFetch';
import { VoucherInterface } from '@app/models';
import { Chip, Typography } from '@mui/material';
import { getRankColor } from '@app/utils';
import { RankType } from '@app/models';

export default function VouchersTable() {
  const { data, isPending, error, postData } = useFetch(
    'http://localhost:3001/voucher',
    'GET',
  );

  const deleteButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button
          variant="text"
          color="error"
          //   onClick={(e) => handleDelete(params)}
        >
          <DeleteOutlineOutlinedIcon />
        </Button>
      </strong>
    );
  };

  const editButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button
          variant="outlined"
          // onClick={(e) => handleEdit(params)}
        >
          Edit
        </Button>
      </strong>
    );
  };

  const rankTag = (params: GridRenderCellParams<any, any, any>) => {
    console.log(params);
    return (
      <Chip
        label={
          <Typography
            variant="body2"
            fontWeight={600}
            textTransform="uppercase"
          >
            {params.row.correspondingRanking}
          </Typography>
        }
        variant="filled"
        color={getRankColor(params.row.correspondingRanking.toLowerCase())}
      />
    );
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 150, sortable: false },
    {
      field: 'voucherName',
      headerName: 'Vouchers',
      flex: 280,
      resizable: true,
    },
    {
      field: 'correspondingRanking',
      headerName: 'Corresponding Ranking',
      flex: 280,
      resizable: true,
      renderCell: (params) => rankTag(params),
    },
    {
      field: 'pointLoss',
      headerName: 'Point Loss',
      flex: 230,
      resizable: true,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      flex: 230,
      resizable: true,
    },
    {
      headerName: 'Status',
      field: 'available',
      flex: 230,
      resizable: true,
    },
    {
      headerName: 'Edit',
      field: 'edit',
      flex: 230,
      resizable: true,
      renderCell: (params) => editButton(params),
    },
    {
      headerName: 'Delete',
      field: 'delete',
      flex: 230,
      resizable: true,
      renderCell: (params) => deleteButton(params),
    },
  ];

  const rows = () =>
    data?.map((voucher) => {
      return {
        id: voucher.id || '0',
        voucherName: voucher.voucherName,
        correspondingRanking: voucher.correspondingRanking,
        available: voucher.available ? 'Available' : 'Non-available',
        pointLoss: voucher.pointLoss,
        amount: voucher.amount,
      };
    }) || [];

  return (
    <div
      style={{
        height: 611,
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
      }}
    >
      <DataGrid
        rows={rows()}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[5]}
        // isRowSelectable={() => false}
        sx={{
          padding: '1rem',
          paddingTop: '0',
          '& .MuiDataGrid-main > div:first-child': {
            zIndex: rows.length === 0 ? 100 : 0,
          },
        }}
      />
    </div>
  );
}
