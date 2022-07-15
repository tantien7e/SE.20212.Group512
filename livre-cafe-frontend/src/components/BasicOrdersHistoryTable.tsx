import { OrderInterface } from '@app/models';
import { TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table, { TableProps } from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';

interface BasicTableProps extends TableProps {
  headCells: JSX.Element[];
  rows: OrderInterface[];
  rowData: (row: OrderInterface, index: number) => JSX.Element;
}

export default function BasicOrdersHistoryTable(props: BasicTableProps) {
  const { headCells, rows, rowData, ...tableProps } = props;

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
              return rowData(row, index);
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
