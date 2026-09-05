import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  TextField,
} from '@mui/material';
import API from '../services/api';

const MyBookings = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.message || '');
  const [reviewDialog, setReviewDialog] = useState({ open: false, booking: null });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const fetchBookings = useCallback(async () => {
    try {
      let response;
      if (user?.role === 'customer') {
        response = await API.get('/bookings/my-bookings');
      } else if (user?.role === 'worker') {
        response = await API.get('/workers/my-bookings');
      }
      setBookings(response?.data || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await API.put(`/bookings/${bookingId}/cancel`);
        setMessage('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await API.put(`/workers/booking/${bookingId}`, { status });
      fetchBookings();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleSubmitReview = async () => {
    try {
      await API.post('/reviews', {
        bookingId: reviewDialog.booking._id,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
      setReviewDialog({ open: false, booking: null });
      setMessage('Review submitted successfully!');
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      'in-progress': 'primary',
      completed: 'success',
      cancelled: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Container>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        My Bookings
      </Typography>
      
      {message && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography>No bookings found.</Typography>
        </Paper>
      ) : (
        bookings.map((booking) => (
          <Paper key={booking._id} sx={{ p: 3, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">Service Provider</Typography>
                <Typography variant="body1">
                  {user?.role === 'customer' ? booking.workerId?.name : booking.customerId?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {booking.workerProfileId?.profession}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">Service Date</Typography>
                <Typography>{new Date(booking.serviceDate).toLocaleDateString()}</Typography>
                <Typography variant="body2">{booking.serviceTime}</Typography>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                <Typography variant="h6" color="primary">Rs. {booking.totalAmount}</Typography>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip label={booking.status} color={getStatusColor(booking.status)} size="small" />
              </Grid>
              
              <Grid item xs={12} md={2}>
                {user?.role === 'customer' && booking.status === 'pending' && (
                  <Button size="small" color="error" onClick={() => handleCancelBooking(booking._id)}>
                    Cancel
                  </Button>
                )}
                {user?.role === 'customer' && booking.status === 'completed' && (
                  <Button size="small" onClick={() => setReviewDialog({ open: true, booking })}>
                    Write Review
                  </Button>
                )}
                {user?.role === 'worker' && booking.status === 'pending' && (
                  <Button size="small" onClick={() => handleUpdateStatus(booking._id, 'confirmed')}>
                    Accept
                  </Button>
                )}
                {user?.role === 'worker' && booking.status === 'confirmed' && (
                  <Button size="small" onClick={() => handleUpdateStatus(booking._id, 'in-progress')}>
                    Start Job
                  </Button>
                )}
                {user?.role === 'worker' && booking.status === 'in-progress' && (
                  <Button size="small" color="success" onClick={() => handleUpdateStatus(booking._id, 'completed')}>
                    Complete
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialog.open} onClose={() => setReviewDialog({ open: false, booking: null })}>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Rating
              value={reviewData.rating}
              onChange={(e, v) => setReviewData({ ...reviewData, rating: v })}
              size="large"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Your Review"
              sx={{ mt: 2 }}
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog({ open: false, booking: null })}>Cancel</Button>
          <Button onClick={handleSubmitReview} variant="contained">Submit Review</Button>
        </DialogActions>
      </Dialog>
    </Container>
    </Box>
    </>
  );
};

export default MyBookings;