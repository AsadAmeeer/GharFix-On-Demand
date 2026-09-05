import React from 'react';
import { Box, Container, Typography, Grid, Paper, Fade } from '@mui/material';
import { Search, EventAvailable, CheckCircleOutline } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  const steps = [
    {
      icon: <Search sx={{ fontSize: 60, color: '#1A2980' }} />,
      title: '1. Find a Professional',
      description: 'Search for verified workers based on your specific home service needs, from plumbing to electrical work.',
    },
    {
      icon: <EventAvailable sx={{ fontSize: 60, color: '#26D0CE' }} />,
      title: '2. Book a Service',
      description: 'Select your preferred professional, choose a convenient date and time, and instantly confirm your booking.',
    },
    {
      icon: <CheckCircleOutline sx={{ fontSize: 60, color: '#4CAF50' }} />,
      title: '3. Relax & Enjoy',
      description: 'The professional will arrive at your doorstep to complete the job. Pay securely and leave a review!',
    },
  ];

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          py: 10, 
          minHeight: 'calc(100vh - 64px)', 
          bgcolor: '#f4f6f8',
          background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
        }}
      >
        <Container>
          <Fade in timeout={800}>
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography variant="h2" fontWeight={800} gutterBottom sx={{ color: '#1A2980' }}>
                How GharFix Works
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                We make it incredibly simple to find, book, and manage professional home services.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in timeout={1000 + index * 200}>
                  <Paper 
                    elevation={24} 
                    sx={{ 
                      p: 5, 
                      textAlign: 'center', 
                      borderRadius: 4, 
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                      }
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      {step.icon}
                    </Box>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </Paper>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default About;
