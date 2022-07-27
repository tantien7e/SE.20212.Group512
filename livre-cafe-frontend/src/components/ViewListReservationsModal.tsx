import { BootstrapDialogTitle } from '@app/components/ViewOrderModal';
import { AreaInterface, CustomerGender } from '@app/models';
import { ReservationStatusBadge } from '@app/screens/WorkSpacesScreen';
import { getSalutation } from '@app/utils';
import { Dialog, DialogContent, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import React from 'react';

export interface ModalProps<T> {
  handleClose: () => void;
  open: boolean;
  item?: T;
}

function ViewListReservationsModal(props: ModalProps<AreaInterface>) {
  const { open, item, handleClose } = props;
  const theme = useTheme();
  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        maxWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            color={theme.palette.secondary.contrastText}
            style={{ padding: ` ${theme.spacing(1)} 0` }}
          >
            <strong style={{ textTransform: 'capitalize' }}>
              View Upcoming Reservations
            </strong>
          </Typography>
        </BootstrapDialogTitle>
        <DialogContent
          dividers
          sx={{
            minWidth: '600px',
            backgroundColor: theme.palette.secondary.main,
            // width: '80vw',
            maxWidth: '100%',
          }}
        >
          <Grid container direction="column">
            <Grid item mb={2}>
              <Typography variant="h6">{item?.name || ''}</Typography>
            </Grid>
            {item?.reservations && item?.reservations?.length > 0 ? (
              item.reservations.map((reservation) => {
                return (
                  <Grid
                    item
                    container
                    sx={{ backgroundColor: 'white', borderRadius: 2 }}
                    p={2}
                    alignItems="center"
                    columnSpacing={2}
                  >
                    <Grid item xs={2}>
                      {moment(reservation.startTime).format('HH:mm A')}
                    </Grid>
                    <Grid item xs={4}>
                      <ReservationStatusBadge status={reservation.status} />
                    </Grid>
                    {reservation.order?.customer?.firstName ? (
                      <Grid item xs={3}>
                        <strong>
                          {getSalutation(
                            reservation.order?.customer?.gender ||
                              CustomerGender.NA,
                          )}{' '}
                          {reservation.order?.customer?.firstName}{' '}
                        </strong>
                        {reservation.order?.customer?.lastName || ''}
                      </Grid>
                    ) : (
                      <Grid item xs={3}>
                        Guest
                      </Grid>
                    )}
                    <Grid item xs>
                      {reservation.additionalRequirements || 'None'}
                    </Grid>
                  </Grid>
                );
              })
            ) : (
              <Grid item container justifyContent="center">
                <Typography variant="h6"> No upcoming reservations</Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ViewListReservationsModal;
