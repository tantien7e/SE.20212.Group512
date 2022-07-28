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
import { useEffect, useState } from 'react';

interface ModalPropsInterface {
  open: boolean;
  handleClose: () => void;
  //   type: InventoryType | 'CUSTOMER';
  handleConfirm: () => void;
  title: string;
  loading?: boolean;
}

export default function ConfirmModal(props: ModalPropsInterface) {
  const { open, handleClose, title, handleConfirm, loading } = props;
  const theme = useTheme();
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (isConfirmed && !loading) {
      handleClose();
    }
  }, [loading, isConfirmed]);

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
                loading={loading}
                loadingPosition="end"
                onClick={() => {
                  setIsConfirmed(true);
                  handleConfirm();
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
