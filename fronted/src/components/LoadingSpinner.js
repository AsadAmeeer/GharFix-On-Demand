import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading...</Typography>
    </Box>
  );
};

export default LoadingSpinner;