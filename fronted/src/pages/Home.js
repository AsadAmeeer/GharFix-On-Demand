import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  useTheme,
  Chip,
  Avatar,
  Paper,
  Stack,
  Fade,
} from '@mui/material';
import {
  HomeRepairService,
  ElectricalServices,
  Plumbing,
  Carpenter,
  FormatPaint,
  Construction,
  CleaningServices,
  Star,
  Verified,
  ArrowForward,
  ShieldOutlined,
  SupportAgent,
  CurrencyRupee,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AIPriceEstimator from '../components/AIPriceEstimator';

const services = [
  { 
    name: 'Electrician', 
    icon: <ElectricalServices sx={{ fontSize: 60 }} />, 
    description: 'Expert wiring, repairs, installations & electrical maintenance',
    color: '#FFB300',
    bgColor: '#FFF8E1',
    workers: 120
  },
  { 
    name: 'Plumber', 
    icon: <Plumbing sx={{ fontSize: 60 }} />, 
    description: 'Pipe fitting, leakage repair, water heater & drainage solutions',
    color: '#0288D1',
    bgColor: '#E1F5FE',
    workers: 95
  },
  { 
    name: 'Carpenter', 
    icon: <Carpenter sx={{ fontSize: 60 }} />, 
    description: 'Custom furniture, wood work, modular kitchen & repairs',
    color: '#5D4037',
    bgColor: '#EFEBE9',
    workers: 80
  },
  { 
    name: 'Painter', 
    icon: <FormatPaint sx={{ fontSize: 60 }} />, 
    description: 'Interior/exterior painting, texture, waterproofing & designs',
    color: '#E91E63',
    bgColor: '#FCE4EC',
    workers: 65
  },
  { 
    name: 'Mason', 
    icon: <Construction sx={{ fontSize: 60 }} />, 
    description: 'Construction, brick work, tiling, flooring & renovation',
    color: '#F57C00',
    bgColor: '#FFF3E0',
    workers: 70
  },
  { 
    name: 'Cleaner', 
    icon: <CleaningServices sx={{ fontSize: 60 }} />, 
    description: 'Deep cleaning, pest control, sanitization & housekeeping',
    color: '#00796B',
    bgColor: '#E0F2F1',
    workers: 110
  },
];

const Home = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HomeRepairService sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800, 
                color: theme.palette.primary.main,
                letterSpacing: '-0.5px'
              }}
            >
              GharFix
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            {(!user || user.role === 'customer') && (
              <Button 
                color="primary" 
                component={Link} 
                to="/workers"
                sx={{ fontWeight: 600 }}
              >
                Find Workers
              </Button>
            )}
            
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/dashboard"
                    sx={{ borderRadius: 2 }}
                  >
                    Dashboard
                  </Button>
                )}
                {user.role !== 'admin' && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/my-bookings"
                    sx={{ borderRadius: 2 }}
                  >
                    My Bookings
                  </Button>
                )}
                {user.role === 'admin' && (
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/admin"
                    sx={{ borderRadius: 2 }}
                  >
                    Admin Portal
                  </Button>
                )}
                <Avatar 
                  src={user.avatar} 
                  sx={{ 
                    ml: 1,
                    bgcolor: theme.palette.primary.main,
                    cursor: 'pointer'
                  }}
                >
                  {user.name?.[0]}
                </Avatar>
              </>
            ) : (
              <>
                <Button 
                  variant="outlined" 
                  component={Link} 
                  to="/login"
                  sx={{ borderRadius: 2 }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/register"
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: '0 4px 14px rgba(0, 118, 255, 0.39)',
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Hero Section with Background Image */}
      <Box
        sx={{
          position: 'relative',
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          background: `linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.6) 100%), url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 100%)',
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box>
                  <Chip 
                    icon={<Star sx={{ color: '#FFD700 !important' }} />}
                    label="Trusted by 10,000+ families"
                    sx={{ 
                      color: 'white', 
                      mb: 2,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      '& .MuiChip-icon': { color: '#FFD700' }
                    }}
                  />
                  <Typography 
                    variant="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 800,
                      color: 'white',
                      lineHeight: 1.2,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    Transform Your Home with Expert Care
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 4, 
                      color: 'rgba(255,255,255,0.9)',
                      fontWeight: 400,
                      lineHeight: 1.6,
                    }}
                  >
                    From fixing a leaky faucet to complete home renovation, 
                    connect with verified professionals for all your home service needs.
                  </Typography>
                  
                  <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate(user?.role === 'worker' ? '/dashboard' : '/workers')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        bgcolor: '#FF6B00',
                        boxShadow: '0 8px 30px rgba(255,107,0,0.4)',
                        '&:hover': {
                          bgcolor: '#FF8A33',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 40px rgba(255,107,0,0.6)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {user?.role === 'worker' ? 'Go to Dashboard' : 'Book a Service Now'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      component={Link}
                      to="/about"
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        color: 'white',
                        borderColor: 'rgba(255,255,255,0.5)',
                        '&:hover': {
                          borderColor: 'white',
                          bgcolor: 'rgba(255,255,255,0.1)',
                        },
                      }}
                    >
                      How It Works
                    </Button>
                  </Stack>

                  <Paper 
                    elevation={24} 
                    sx={{ 
                      p: 3, 
                      borderRadius: 4,
                      display: 'flex',
                      gap: 4,
                      flexWrap: 'wrap',
                      justifyContent: 'space-around',
                      bgcolor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    {[
                      { icon: <Verified sx={{ color: '#2196F3' }} />, text: 'Verified Workers' },
                      { icon: <ShieldOutlined sx={{ color: '#4CAF50' }} />, text: 'Service Guarantee' },
                      { icon: <SupportAgent sx={{ color: '#FF9800' }} />, text: '24/7 Support' },
                      { icon: <CurrencyRupee sx={{ color: '#9C27B0' }} />, text: 'Best Prices' },
                    ].map((item, index) => (
                      <Box key={index} sx={{ textAlign: 'center' }}>
                        <Box sx={{ fontSize: 40, mb: 1 }}>{item.icon}</Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.text}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <AIPriceEstimator />
              </Grid>
            </Grid>
          </Fade>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ bgcolor: '#F8F9FA', py: 6 }}>
        <Container>
          <Grid container spacing={3}>
            {[
              { number: '10,000+', label: 'Happy Customers', icon: '👥' },
              { number: '1,500+', label: 'Skilled Workers', icon: '👷' },
              { number: '50,000+', label: 'Services Completed', icon: '✅' },
              { number: '4.8/5', label: 'Average Rating', icon: '⭐' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Card sx={{ 
                  textAlign: 'center', 
                  py: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <Typography variant="h3" sx={{ fontSize: '2.5rem', mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="primary">
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section with Improved Graphics */}
      <Box sx={{ py: 8, bgcolor: '#FAFBFC' }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip label="OUR SERVICES" color="primary" sx={{ mb: 2, fontWeight: 600 }} />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Professional Home Services
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Expert solutions for all your home maintenance needs at competitive prices
            </Typography>
          </Box>
          
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.name}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 4,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 60px rgba(0,0,0,0.12)`,
                    }
                  }}
                  onClick={() => navigate('/workers')}
                >
                  <Box sx={{ 
                    bgcolor: service.bgColor, 
                    p: 3, 
                    textAlign: 'center',
                    color: service.color,
                  }}>
                    {service.icon}
                  </Box>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {service.name}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {service.description}
                    </Typography>
                    <Chip 
                      icon={<Star />} 
                      label={`${service.workers}+ verified workers`}
                      size="small"
                      sx={{ bgcolor: service.bgColor, color: service.color }}
                    />
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button 
                      size="small" 
                      endIcon={<ArrowForward />}
                      sx={{ color: service.color, fontWeight: 600 }}
                    >
                      Book Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section with Another Background Image */}
      <Box
        sx={{
          position: 'relative',
          py: 12,
          background: `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 100%), url('https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          textAlign: 'center',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ color: 'white' }}>
            Ready to Fix Your Home?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
            Join 10,000+ happy homeowners who trust GharFix for quality home services
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 3,
              bgcolor: '#FF6B00',
              boxShadow: '0 8px 30px rgba(255,107,0,0.4)',
              '&:hover': {
                bgcolor: '#FF8A33',
              },
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Footer */}
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
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Your trusted partner for all home maintenance and repair services. 
                Quality work, verified professionals, and 100% satisfaction guarantee.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom>Services</Typography>
              {['Electrician', 'Plumber', 'Carpenter', 'Painter'].map(service => (
                <Typography key={service} variant="body2" sx={{ mb: 1, opacity: 0.7, cursor: 'pointer' }}>
                  {service}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="h6" gutterBottom>Company</Typography>
              {['About Us', 'Contact', 'Blog', 'Careers'].map(item => (
                <Typography key={item} variant="body2" sx={{ mb: 1, opacity: 0.7, cursor: 'pointer' }}>
                  {item}
                </Typography>
              ))}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>Contact Info</Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                📞 03008792151
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                ✉️ asadameer656@gmail.com
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.7 }}>
                📍 123 service lane, Mailsi, Pakistan
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.5 }}>
              © 2024 GharFix - Your Trusted Home Service Provider. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Home;