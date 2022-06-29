import LoginBox from '@app/components/LoginBox';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import StorefrontIcon from '@mui/icons-material/Storefront';

function LoginScreen() {
  const theme = useTheme();
  return (
    <Grid
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Box position="absolute" top={10} left={24}>
        <Box display="flex" alignItems="center" rowGap={2}>
          <StorefrontIcon
            sx={{
              fontSize: '24px',
              color: theme.palette.primary.main,
              marginRight: 1,
            }}
          />
          <Typography
            variant="h1"
            noWrap={true}
            sx={{
              display: { xs: 'none', sm: 'initial' },
              fontSize: '24px',
              fontWeight: 600,
              color: theme.palette.primary.main,
              width: '154px',
              fontFamily: 'Caveat, cursive',
            }}
          >
            Lirve Café
          </Typography>
        </Box>
      </Box>
      <LoginBox />
    </Grid>
  );
}

export default LoginScreen;
