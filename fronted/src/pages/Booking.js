import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import API from '../services/api';

const Booking = () => {
  const { id: workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    serviceDate: dayjs().add(1, 'day'),
    serviceTime: '10:00 AM',
    address: { street: '', city: '', pincode: '' },
    description: '',
    paymentMethod: 'cash',
  });

  const fetchWorker = useCallback(async () => {
    try {
      const response = await API.get(`/workers/profile/${workerId}`);
      setWorker(response.data);
    } catch (error) {
      setError('Failed to load worker details');
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchWorker();
  }, [fetchWorker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'street' || name === 'city' || name === 'pincode') {
      setFormData({
        ...formData,
        address: { ...formData.address, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookingData = {
        workerId,
        serviceDate: formData.serviceDate.format('YYYY-MM-DD'),
        serviceTime: formData.serviceTime,
        address: formData.address,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
      };
      await API.post('/bookings', bookingData);
      navigate('/my-bookings', { state: { message: 'Booking created successfully!' } });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <>
      <Navbar />
      <Box sx={{ py: 8, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Book Service
          </Typography>
          <Typography variant="h6" gutterBottom>
            with {worker?.userId?.name} ({worker?.profession})
          </Typography>
          <Typography variant="body2" color="primary" gutterBottom>
            Rate: Rs. {worker?.hourlyRate}/hour
          </Typography>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Service Date"
                  value={formData.serviceDate}
                  onChange={(newDate) => setFormData({ ...formData, serviceDate: newDate })}
                  minDate={dayjs()}
                  sx={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Service Time"
                  name="serviceTime"
                  value={formData.serviceTime}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'].map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  name="street"
                  value={formData.address.street}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.address.city}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Service Description (optional)"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the work you need done..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  select
                  label="Payment Method"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <MenuItem value="cash">Cash on Service</MenuItem>
                  <MenuItem value="card">Credit/Debit Card</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" fullWidth variant="contained" size="large">
                  Confirm Booking
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
      </Box>
    </>
    </LocalizationProvider>
  );
};

export default Booking;