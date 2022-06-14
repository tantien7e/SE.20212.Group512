import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  BookInterface,
  CUSTOMER,
  CustomerInterface,
  DrinkInterface,
} from '@app/models';
import { InventoryType } from '@app/constants';
import { Grid, TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteDrink,
  selectDrinksDeleteLoading,
} from '@app/app/features/drinks/drinks-slice';
import {
  deleteBook,
  selectBooksDeleteLoading,
} from '@app/app/features/books/books-slice';
import { deleteCustomer } from '@app/app/features/customers/customers-slice';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item?: DrinkInterface & BookInterface & CustomerInterface;
  type: InventoryType | 'CUSTOMER';
}

export default function DeleteConfirmModal(props: ModalPropsInterface) {
  const { open, handleClose, item, type } = props;
  const theme = useTheme();
  const deleteDrinkLoading = useSelector(selectDrinksDeleteLoading);
  const deleteBookLoading = useSelector(selectBooksDeleteLoading);
  const dispatch = useDispatch();
  const [confirmText, setConfirmText] = React.useState('');
  const [deleteError, setDeleteError] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const handleDelete = () => {
    if (
      (type === InventoryType.DRINK && item?.name !== confirmText) ||
      (type === InventoryType.BOOK && item?.title !== confirmText) ||
      (type === CUSTOMER && item?.firstName !== confirmText)
    ) {
      setDeleteError(true);
      return;
    }
    setDeleteError(false);
    if (type === InventoryType.DRINK) {
      dispatch(deleteDrink(item as DrinkInterface));
    } else if (type === InventoryType.BOOK) {
      //Delete books here
      dispatch(deleteBook(item as BookInterface));
    } else if (type === CUSTOMER) {
      dispatch(deleteCustomer(item as CustomerInterface));
    }
    setDeleteSuccess(true);
  };

  React.useEffect(() => {
    const deleteLoading = deleteBookLoading || deleteDrinkLoading;
    if (deleteSuccess && !deleteLoading) {
      handleClose();
    }
  }, [deleteSuccess, deleteBookLoading, deleteDrinkLoading]);
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">
          {`Do you want to delete item ${
            item?.name || item?.title || item?.firstName || ''
          }?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To delete this item, please enter the item's name here.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
            }}
            error={deleteError}
            helperText={deleteError && "Wrong item's name"}
          />
        </DialogContent>
        <DialogActions>
          <Grid
            container
            justifyContent="space-between"
            padding={`${theme.spacing(2)}`}
          >
            <Grid>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
            </Grid>
            <Grid>
              <LoadingButton
                variant="contained"
                loading={deleteBookLoading || deleteDrinkLoading}
                loadingPosition="end"
                onClick={() => handleDelete()}
                endIcon={<DeleteIcon />}
              >
                Delete{' '}
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}
