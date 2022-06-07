import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { BookInterface, DrinkInterface } from '@app/models';
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

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item?: DrinkInterface & BookInterface;
  type: InventoryType;
}

export default function DeleteConfirmModal(props: ModalPropsInterface) {
  const { open, handleClose, item, type } = props;
  const theme = useTheme();
  const deleteLoading = useSelector(selectDrinksDeleteLoading);
  const dispatch = useDispatch();
  const [confirmText, setConfirmText] = React.useState('');
  const [deleteError, setDeleteError] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const handleDelete = () => {
    if (
      (type === InventoryType.DRINK && item?.name !== confirmText) ||
      (type === InventoryType.BOOK && item?.title !== confirmText)
    ) {
      setDeleteError(true);
      return;
    }
    setDeleteError(false);
    if (type === InventoryType.DRINK) {
      dispatch(deleteDrink(item as DrinkInterface));
    } else if (type === InventoryType.BOOK) {
      //Delete books here
    }
    setDeleteSuccess(true);
  };

  React.useEffect(() => {
    if (deleteSuccess && !deleteLoading) {
      handleClose();
    }
  }, [deleteSuccess, deleteLoading]);
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
          {`Do you want to delete item ${item?.name || item?.title}?`}
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
                loading={deleteLoading}
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
