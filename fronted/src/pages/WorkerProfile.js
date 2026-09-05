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
  Button,
  Rating,
  Chip,
  Divider,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import API from '../services/api';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkerData = useCallback(async () => {
    try {
      const [workerRes, reviewsRes] = await Promise.all([
        API.get(`/workers/profile/${id}`),
        API.get(`/reviews/worker/${id}`),
      ]);
      setWorker(workerRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error('Failed to fetch worker data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWorkerData();
  }, [fetchWorkerData]);

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'customer') {
      navigate(`/booking/${id}`);
    } else {
      alert('Please register as a customer to book services');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!worker) {
    return (
      <Container>
        <Typography>Worker not found</Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', bgcolor: 'background.default' }}>
      <Container maxWidth="md">
      <Grid container spacing={4}>
        {/* Worker Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              src={worker.userId?.profileImage}
            >
              {worker.userId?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h5">{worker.userId?.name}</Typography>
            <Chip label={worker.profession} color="primary" sx={{ my: 1 }} />
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 1 }}>
              <Rating value={worker.averageRating} readOnly precision={0.5} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({worker.totalReviews} reviews)
              </Typography>
            </Box>
            <Typography variant="h4" color="primary" sx={{ my: 2 }}>
              Rs. {worker.hourlyRate}
              <Typography component="span" variant="body2">/hour</Typography>
            </Typography>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleBookNow}
              disabled={!worker.isAvailable}
            >
              {worker.isAvailable ? 'Book Now' : 'Currently Unavailable'}
            </Button>
          </Paper>
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>About</Typography>
            <Typography paragraph>{worker.description}</Typography>
            
            <Typography variant="h6" gutterBottom>Experience</Typography>
            <Typography>{worker.experience} years of professional experience</Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Skills</Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {worker.skills?.map((skill, idx) => (
                <Chip key={idx} label={skill} size="small" variant="outlined" />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Location</Typography>
            <Typography>{worker.location?.city}, {worker.location?.area}</Typography>
          </Paper>

          {/* Reviews */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
            {reviews.length === 0 ? (
              <Typography color="text.secondary">No reviews yet</Typography>
            ) : (
              <List>
                {reviews.map((review) => (
                  <React.Fragment key={review._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Rating value={review.rating} readOnly size="small" />
                            <Typography variant="body2" color="text.secondary">
                              {review.customerId?.name}
                            </Typography>
                          </Box>
                        }
                        secondary={review.comment}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </Box>
    </>
  );
};

export default WorkerProfile;