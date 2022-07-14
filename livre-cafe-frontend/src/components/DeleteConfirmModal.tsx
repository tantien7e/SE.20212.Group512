import { selectBooksDeleteLoading } from '@app/app/features/books/books-slice';
import { selectDrinksDeleteLoading } from '@app/app/features/drinks/drinks-slice';
import { InventoryType } from '@app/constants';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  item?: { name: string };
  handleDelete: (
    confirmText: string,
    setDeleteError: React.Dispatch<React.SetStateAction<boolean>>,
    setDeleteSuccess: React.Dispatch<React.SetStateAction<boolean>>,
  ) => void;
}

export default function DeleteConfirmModal(props: ModalPropsInterface) {
  const { open, handleClose, item, handleDelete } = props;
  const theme = useTheme();
  const deleteDrinkLoading = useSelector(selectDrinksDeleteLoading);
  const deleteBookLoading = useSelector(selectBooksDeleteLoading);
  const [confirmText, setConfirmText] = React.useState('');
  const [deleteError, setDeleteError] = React.useState(false);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

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
          {`Do you want to delete item ${item?.name || ''}?`}
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
                onClick={() => {
                  handleDelete(confirmText, setDeleteError, setDeleteSuccess);
                }}
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
