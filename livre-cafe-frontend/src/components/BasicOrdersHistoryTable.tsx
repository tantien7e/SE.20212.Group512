import { OrderStatusBadge } from '@app/components/OrdersTable';
import { OrderInterface } from '@app/models';
import { numberWithCommasRound2 } from '@app/utils';
import { TablePagination, Tooltip, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useState } from 'react';

interface BasicTableProps extends TableProps {
  headCells: JSX.Element[];
  rows: OrderInterface[];
}

export default function BasicOrdersHistoryTable(props: BasicTableProps) {
  const { headCells, rows, ...tableProps } = props;

  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table sx={{ minWidth: 600 }} aria-label="simple table" {...tableProps}>
          <TableHead>
            <TableRow>{headCells.map((cell) => cell)}</TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const { customer } = row;
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  key={row._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
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
                  <TableCell align="left">
                    {row.itemsOrdered.reduce(
                      (a, c, cIndex) =>
                        a +
                        (c.product.title || c.product.name) +
                        (cIndex < row.itemsOrdered.length - 1 ? ', ' : '.'),
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
