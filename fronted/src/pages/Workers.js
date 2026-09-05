import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  MenuItem,
  Rating,
  Box,
  Chip,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  Stack,
} from '@mui/material';
import {
  Search,
  LocationOn,
  Work,
  Verified,
  FilterList,
  Clear,
} from '@mui/icons-material';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const professions = [
  { value: '', label: 'All Professionals' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mason', label: 'Mason' },
  { value: 'cleaner', label: 'Cleaner' },
];

const cities = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad'
];

const Workers = () => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    profession: '',
    city: '',
    minRate: '',
    maxRate: '',
  });

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.profession) params.append('profession', filters.profession);
      if (filters.city) params.append('city', filters.city);
      if (filters.minRate) params.append('minRate', filters.minRate);
      if (filters.maxRate) params.append('maxRate', filters.maxRate);

      const response = await API.get(`/workers/workers?${params.toString()}`);
      setWorkers(response.data);
    } catch (error) {
      console.error('Failed to fetch workers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ profession: '', city: '', minRate: '', maxRate: '' });
  };

  return (
    <>
      <Navbar />
      <Box 
        sx={{ 
          position: 'relative',
          py: 8, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)',
          color: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Animated background shapes */}
        <Box 
          sx={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
            animation: 'pulse 4s ease-in-out infinite alternate',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '100%': { transform: 'scale(1.1)' }
            }
          }}
        />
        
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" fontWeight={800} gutterBottom sx={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            Find a Professional
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Connect with verified and trusted service providers near you
          </Typography>

          {/* Main Search Bar */}
          <Paper 
            elevation={24} 
            sx={{ 
              p: 3, 
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField
                fullWidth
                select
                label="Profession"
                name="profession"
                value={filters.profession}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Work color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {professions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                select
                label="City"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>

              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                startIcon={<FilterList />}
                sx={{ whiteSpace: 'nowrap', minWidth: 'max-content', height: '56px' }}
              >
                More Filters
              </Button>

              <Button
                variant="contained"
                onClick={fetchWorkers}
                startIcon={<Search />}
                sx={{ whiteSpace: 'nowrap', minWidth: 'max-content', height: '56px' }}
              >
                Search
              </Button>
            </Stack>

            {/* Advanced Filters */}
            {showFilters && (
              <Grid container spacing={2} sx={{ mt: 2, pt: 2, borderTop: '1px solid #E0E0E0' }}>
                <Grid item xs={12} md={6}>
                  <Typography gutterBottom>Price Range (per hour)</Typography>
                  <Stack direction="row" spacing={2}>
                    <TextField
                      label="Min (Rs.)"
                      name="minRate"
                      type="number"
                      value={filters.minRate}
                      onChange={handleFilterChange}
                      size="small"
                    />
                    <TextField
                      label="Max (Rs.)"
                      name="maxRate"
                      type="number"
                      value={filters.maxRate}
                      onChange={handleFilterChange}
                      size="small"
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Button
                    variant="text"
                    startIcon={<Clear />}
                    onClick={clearFilters}
                    size="small"
                  >
                    Clear All Filters
                  </Button>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Container>
      </Box>

      <Container sx={{ py: 6 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={60} />
          </Box>
        ) : workers.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>No professionals found</Typography>
            <Typography color="text.secondary">
              Try adjusting your filters or search in a different city
            </Typography>
            <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {workers
              .filter(w => (user?.role === 'worker' ? w.userId?._id === user.id : true))
              .map((worker) => (
              <Grid item xs={12} sm={6} md={4} key={worker._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 4,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {worker.userId?.name}
                      </Typography>
                      <Chip
                        label={worker.verified ? 'Verified' : 'Pending'}
                        size="small"
                        icon={worker.verified ? <Verified sx={{ fontSize: 16 }} /> : null}
                        color={worker.verified ? 'primary' : 'default'}
                      />
                    </Box>

                    <Chip
                      label={worker.profession?.toUpperCase()}
                      size="small"
                      color="secondary"
                      sx={{ mb: 1 }}
                    />

                    <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                      <Rating value={worker.averageRating} readOnly precision={0.5} size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                        ({worker.totalReviews} reviews)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      ⏱ {worker.experience} years experience
                    </Typography>

                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      {worker.description?.substring(0, 100)}...
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <Typography variant="h5" color="primary" fontWeight={700}>
                        Rs. {worker.hourlyRate}
                        <Typography component="span" variant="body2" color="text.secondary">
                          /hour
                        </Typography>
                      </Typography>
                      <Chip
                        label={worker.isAvailable ? 'Available' : 'Busy'}
                        size="small"
                        color={worker.isAvailable ? 'success' : 'error'}
                      />
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      component={Link}
                      to={`/workers/${worker.userId?._id}`}
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1.05rem',
                        boxShadow: '0 8px 16px rgba(0, 118, 255, 0.2)',
                      }}
                    >
                      View Profile & Book
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Workers;