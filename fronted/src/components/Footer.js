import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Stack,
  TextField,
  Button,
} from '@mui/material';
import {
  HomeRepairService,
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#1A1A1A', color: 'white', py: 6 }}>
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <HomeRepairService sx={{ color: '#FF6B00' }} />
              <Typography variant="h5" fontWeight={700}>
                GharFix
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
              Your trusted partner for all home maintenance and repair services.
              Quality work, verified professionals, and 100% satisfaction guarantee.
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: 'white', '&:hover': { color: '#FF6B00' } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: '#FF6B00' } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: '#FF6B00' } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: 'white', '&:hover': { color: '#FF6B00' } }}>
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Services
            </Typography>
            {['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'Cleaner'].map((service) => (
              <Typography
                key={service}
                variant="body2"
                sx={{ mb: 1, opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}
              >
                {service}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Company
            </Typography>
            {['About Us', 'Contact', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
              <Typography
                key={item}
                variant="body2"
                sx={{ mb: 1, opacity: 0.7, cursor: 'pointer', '&:hover': { opacity: 1 } }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
              Subscribe to get updates on offers and new services
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                placeholder="Your email"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& .MuiInputBase-root': { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  },
                }}
              />
              <Button variant="contained" sx={{ bgcolor: '#FF6B00' }}>
                Subscribe
              </Button>
            </Stack>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 4, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.5 }}>
            © 2024 GharFix - Your Trusted Home Service Provider. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;