import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Paper,
  Stack,
  InputAdornment,
} from '@mui/material';
import { AutoAwesome, Work, Star } from '@mui/icons-material';
import API from '../services/api';

const professions = [
  { value: 'electrician', label: 'Electrician' },
  { value: 'plumber', label: 'Plumber' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'mason', label: 'Mason' },
  { value: 'cleaner', label: 'Cleaner' },
];

const AIPriceEstimator = () => {
  const [formData, setFormData] = useState({
    profession: '',
    experience: '',
    city: 'Lahore', // default
  });
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async () => {
    if (!formData.profession || formData.experience === '') {
      setError('Please provide both profession and experience.');
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await API.post('/ai/predict-price', formData);
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to get prediction from AI.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper 
      elevation={24}
      sx={{
        p: 4,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      }}
    >
      {/* Animated gradient background accent */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, rgba(255, 107, 0, 0.1), rgba(156, 39, 176, 0.1), rgba(33, 150, 243, 0.1))',
          animation: 'rotate 15s linear infinite',
          zIndex: 0,
          '@keyframes rotate': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          }
        }}
      />
      
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
          <AutoAwesome sx={{ color: '#9C27B0', fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700} sx={{ background: '-webkit-linear-gradient(45deg, #FF6B00, #9C27B0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Price Estimator
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Get real-time market price estimates powered by our Neural Network trained on thousands of completed jobs.
        </Typography>

        <Stack spacing={3}>
          <TextField
            select
            fullWidth
            label="Service Type"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Work color="primary" /></InputAdornment>,
            }}
          >
            {professions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="number"
            fullWidth
            label="Years of Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Star color="primary" /></InputAdornment>,
            }}
          />

          {error && <Typography color="error" variant="body2">{error}</Typography>}

          <Button
            variant="contained"
            size="large"
            onClick={handlePredict}
            disabled={loading}
            sx={{
              background: 'linear-gradient(45deg, #FF6B00, #FF8A33)',
              boxShadow: '0 8px 20px rgba(255, 107, 0, 0.3)',
              color: 'white',
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #FF8A33, #FF6B00)',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(255, 107, 0, 0.4)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Predict Price'}
          </Button>

          {prediction && (
            <Box 
              sx={{ 
                mt: 2, 
                p: 3, 
                borderRadius: 3, 
                bgcolor: 'rgba(156, 39, 176, 0.05)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
                textAlign: 'center'
              }}
            >
              <Typography variant="overline" color="secondary" fontWeight={600}>
                Estimated Hourly Rate
              </Typography>
              <Typography variant="h3" fontWeight={800} color="primary" sx={{ mt: 1 }}>
                Rs. {prediction.predictedRate}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                {prediction.isFallback ? 'Based on baseline market rates' : 'Powered by GharFix AI Model'}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default AIPriceEstimator;
