import { useTheme } from '@mui/material/styles';
import { Box, Button } from '@mui/material';
import React from 'react';

function ListAction() {
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
      mx = {1}
    >
      <Button variant="outlined" sx={{ textTransform: 'none', m: 1, my: 0.5 }}>
        Add Reservation
      </Button>
      <Button variant="outlined" sx={{ textTransform: 'none', m: 1, my: 0.5 }}>
        Mark as Unavailable
      </Button>
    </Box>
  );
}

export default ListAction;
