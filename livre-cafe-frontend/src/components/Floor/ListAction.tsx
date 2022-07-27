import { useTheme } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import React from 'react';
import { LoadingButton } from '@mui/lab';

interface ListActionProps {
  handleAddReservation: () => void;
  handleViewAreaReservations: () => void;
  handleUpdateArea: () => void;
  updateLoading?: boolean;
  available?: boolean;
}

function ListAction(props: ListActionProps) {
  const {
    handleAddReservation,
    handleUpdateArea,
    updateLoading,
    available,
    handleViewAreaReservations,
  } = props;
  const theme = useTheme();
  return (
    <Box
      minWidth={300}
      sx={{
        backgroundColor: 'white',
        boxShadow: theme.shadows[10],
        borderRadius: '4px',
      }}
      display="flex"
      flexDirection="column"
      py={0.5}
      mx={1}
    >
      {available && (
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', m: 1, my: 0.5 }}
          onClick={() => handleAddReservation()}
        >
          Add Reservation
        </Button>
      )}
      {available ? (
        <LoadingButton
          variant="outlined"
          sx={{ textTransform: 'none', m: 1, my: 0.5 }}
          onClick={() => handleUpdateArea()}
          loading={updateLoading}
        >
          Mark as Unavailable
        </LoadingButton>
      ) : (
        <LoadingButton
          variant="outlined"
          sx={{ textTransform: 'none', m: 1, my: 0.5 }}
          onClick={() => handleUpdateArea()}
          loading={updateLoading}
        >
          Mark as available
        </LoadingButton>
      )}
      {available && (
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', m: 1, my: 0.5 }}
          onClick={() => handleViewAreaReservations()}
        >
          View Upcoming Reservations
        </Button>
      )}
    </Box>
  );
}

export default ListAction;
