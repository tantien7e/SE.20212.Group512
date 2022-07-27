import React, { useContext, useEffect, useState } from 'react';
import {
  DataGrid,
  GridColDef,
  GridColumns,
  GridRenderCellParams,
  GridRowsProp,
} from '@mui/x-data-grid';
import { Helmet } from 'react-helmet-async';
import type { } from '@mui/x-data-grid/themeAugmentation';
import { CartItemInterface, Store } from '@app/context/Store';
import { relative } from 'node:path/win32';
import { idID } from '@mui/material/locale';
import { parseClassName } from 'react-toastify/dist/utils';
import CartCheckoutScreen from '@app/screens/CartCheckoutScreen';
import { Params, useNavigate } from 'react-router-dom';
import EditCartModal from './EditCartModal';

import { current } from '@reduxjs/toolkit';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import Button from '@mui/material/Button';
import { useFetch } from '@app/hooks/useFetch';
import { VoucherInterface } from '@app/models';
import { Chip, Grid, Toolbar, Tooltip, Typography } from '@mui/material';
// import { getRankByindex, getRankColor } from '@app/utils';
import { RankType, RankIndex } from '@app/models';
import EditVoucherModal from './EditVoucherModal';
import { CartStateInterface } from '@app/context/Store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteVoucher, fetchVouchers, selectVouchers } from '@app/app/features/vouchers/vouchers-slice';
import { getRankColor } from '@app/utils';

export default function VouchersTable(props: { ranksSelected: string[] }) {
  const user = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') || '')
    : null;
  const { ranksSelected } = props;
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(true);
  const [currentVoucher, setCurrentVoucher] = useState<VoucherInterface>();
  const [currentDeleteVoucher, setCurrentDeleteVoucher] = useState<VoucherInterface>();
  const dispatch = useDispatch();
  const vouchersSelector = useSelector(selectVouchers);
  const { vouchers, loading } = vouchersSelector;

  const rows = () => {
    const newVouchers = vouchers?.filter((cur) => ranksSelected.includes(cur.correspondingRank))
    return newVouchers?.map((voucher: VoucherInterface, id) => {
      return {
        id: id,
        _id: voucher._id,
        name: voucher.name,
        correspondingRank: voucher.correspondingRank,
        available: voucher.available ? 'Available' : 'Non - Available',
        pointsCost: voucher.pointsCost,
        percentageDiscount: voucher.percentageDiscount + "%",
        maxAmount: voucher.maxAmount + "$",
      };
    }
    ) || [] as VoucherInterface[];
  }

  useEffect(() => {
    console.log(currentDeleteVoucher)
    if (!currentDeleteVoucher) return;
    else dispatch(deleteVoucher(currentDeleteVoucher._id));
  }, [currentDeleteVoucher])

  const handleEdit = (params: GridRenderCellParams<any, any, any>) => {
    const filteredVoucher = vouchers?.filter((voucher) => (voucher._id === params.row._id)) || []
    setCurrentVoucher(filteredVoucher[filteredVoucher?.length - 1]);
    setOpenEditModal(true);
  };

  const handleDelete = (params: GridRenderCellParams<any, any, any>) => {
    const filteredVoucher = vouchers?.filter((voucher) => (voucher._id === params.row._id)) || []
    setCurrentDeleteVoucher(filteredVoucher[filteredVoucher?.length - 1]);
  }

  useEffect(() => {
    if (!vouchers) dispatch(fetchVouchers());
  }, [vouchers]);

  const deleteButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button
          variant="text"
          color="error"
          onClick={(e) => handleDelete(params)}
          disabled={!user?.isManager}
        >
          <DeleteOutlineOutlinedIcon />
        </Button>
      </strong>
    );
  };

  const editButton = (params: GridRenderCellParams<any, any, any>) => {
    return (
      <strong>
        <Button variant="outlined" onClick={(e) => handleEdit(params)}
          disabled={!user?.isManager}>
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
            {params.row.correspondingRank}
          </Typography>
        }
        variant="filled"
        color={getRankColor(params.row.correspondingRank?.toLowerCase())}
      />
    );
  };

  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', sortable: false, flex: 140 },
    {
      field: 'name',
      headerName: 'Voucher Name',
      flex: 280,
      resizable: true,
    },
    {
      field: 'correspondingRank',
      headerName: 'Corresponding Ranking',
      flex: 260,
      resizable: true,
      renderCell: (params) => rankTag(params),
    },
    {
      field: 'pointsCost',
      headerName: 'Point Loss',
      flex: 180,
      resizable: true,
    },
    {
      field: 'percentageDiscount',
      headerName: 'Percentage',
      flex: 180,
      resizable: true,
    },
    {
      field: 'maxAmount',
      headerName: 'Max Amount',
      flex: 180,
      resizable: true,
    },
    {
      headerName: 'Status',
      field: 'available',
      flex: 150,
      resizable: true,
    },
    {
      headerName: 'Edit',
      field: 'edit',
      flex: 120,
      resizable: true,
      renderCell: (params) => editButton(params),
    },
    {
      headerName: 'Delete',
      field: 'delete',
      flex: 120,
      resizable: true,
      renderCell: (params) => deleteButton(params),
    },
  ];

  return (
    <div>
      {currentVoucher && openEditModal && (
        <EditVoucherModal
          open={openEditModal}
          handleClose={() => {
            setOpenEditModal(false);
          }}
          item={currentVoucher}
        />
      )}
      <div
        style={{
          height: 611,
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
        }}
      >
        <DataGrid
          rows={rows() || [] as VoucherInterface[]}
          columns={columns}
          rowHeight={75}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          isRowSelectable={() => false}
          // autoHeight={false}
          loading={loading}
          headerHeight={80}
          density={"comfortable"}
          sx={{
            padding: '1rem',
            paddingTop: '0',
            '& .MuiDataGrid-main > div:first-child': {
              zIndex: rows?.length === 0 ? 100 : 0,
            },
          }}
        />
      </div>
    </div>
  );
}
