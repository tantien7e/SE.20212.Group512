import { OrderInterface } from '@app/models';
import { LoadingButton } from '@mui/lab';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

import CheckIcon from '@mui/icons-material/Check';
import { selectOrdersUpdateLoading } from '@app/app/features/orders/orders-slice';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  //   type: InventoryType | 'CUSTOMER';
  handleConfirm: () => void;
  title: string;
}

export default function ConfirmModal(props: ModalPropsInterface) {
  const { open, handleClose, title, handleConfirm } = props;
  const theme = useTheme();
  const updateLoading = useSelector(selectOrdersUpdateLoading);

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
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent></DialogContent>
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
                loading={updateLoading}
                loadingPosition="end"
                onClick={() => {
                  handleConfirm();
                  if (!updateLoading) handleClose();
                }}
                endIcon={<CheckIcon />}
              >
                Confirm
              </LoadingButton>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </div>
  );
}
