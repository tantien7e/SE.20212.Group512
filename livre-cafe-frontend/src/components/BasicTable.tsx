import React from 'react';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { CartItemInterface } from '@app/context/Store';
import { numberWithCommasRound2 } from '@app/utils';

interface BasicTableProps extends TableProps {
  headCells: JSX.Element[];
  rows: CartItemInterface[];
}

export default function BasicTable(props: BasicTableProps) {
  const { headCells, rows, ...tableProps } = props;
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
      <Table sx={{ minWidth: 600 }} aria-label="simple table" {...tableProps}>
        <TableHead>
          <TableRow>{headCells.map((cell) => cell)}</TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name || row.title}
              </TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">
                {numberWithCommasRound2(row.price)}
              </TableCell>
              <TableCell align="right">
                {numberWithCommasRound2(row.price * row.quantity)}
              </TableCell>
              <TableCell align="right">
                {row.additionalRequirement || 'None'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
