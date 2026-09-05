import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  MenuItem,
  Alert,
  Fade,
  Divider,
  Avatar
} from '@mui/material';
import { Person, Work, ShoppingCart, VerifiedUser, BuildCircle, AccessTime } from '@mui/icons-material';
import API from '../services/api';

const glassStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  color: 'white',
  borderRadius: '16px',
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: 'white',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#43E97B',
    },
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#43E97B',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  }
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(null);
  const [workerProfile, setWorkerProfile] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    profession: '',
    experience: '',
    description: '',
    hourlyRate: '',
    location: { city: '', area: '' },
    skills: '',
  });

  const fetchWorkerProfile = useCallback(async () => {
    try {
      const response = await API.get(`/workers/profile/${user.id}`);
      setWorkerProfile(response.data);
      setFormData({
        profession: response.data.profession,
        experience: response.data.experience,
        description: response.data.description,
        hourlyRate: response.data.hourlyRate,
        location: response.data.location,
        skills: response.data.skills.join(', '),
      });
    } catch (error) {
      console.error('No profile found');
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.role === 'worker') {
      fetchWorkerProfile();
    }
  }, [user, fetchWorkerProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'area') {
      setFormData({
        ...formData,
        location: { ...formData.location, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()),
      };
      await API.post('/workers/profile', submitData);
      setMessage({ type: 'success', text: 'Worker profile updated successfully!' });
      fetchWorkerProfile();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          pt: 10,
          pb: 6,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>

          {/* Header Section */}
          <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#43E97B',
                fontSize: '2rem',
                boxShadow: '0 0 20px rgba(67, 233, 123, 0.4)'
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 0.5 }}>
                Dashboard
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 400 }}>
                Welcome back!
              </Typography>
            </Box>
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mb: 4, borderRadius: 2 }} onClose={() => setMessage('')}>
              {message.text}
            </Alert>
          )}

          <Fade in={!activeView} timeout={500}>
            <Box display={!activeView ? 'block' : 'none'}>
              {/* Quick Stats Section */}
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ ...glassStyle, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUser sx={{ color: '#43E97B', fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Account Status</Typography>
                      <Typography variant="h6" fontWeight="bold">Active</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ ...glassStyle, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessTime sx={{ color: '#38F9D7', fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Member Since</Typography>
                      <Typography variant="h6" fontWeight="bold">2026</Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ ...glassStyle, p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <BuildCircle sx={{ color: '#FFD700', fontSize: 40 }} />
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Role</Typography>
                      <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>

              {/* Action Cards */}
              <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 700 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper
                    onClick={() => setActiveView('profile')}
                    sx={{
                      ...glassStyle,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                      <Person sx={{ fontSize: 40, color: '#fff' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>My Profile</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>View and manage your personal details.</Typography>
                  </Paper>
                </Grid>

                {user?.role === 'customer' ? (
                  <Grid item xs={12} md={4}>
                    <Paper
                      onClick={() => navigate('/workers')}
                      sx={{
                        ...glassStyle,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box sx={{ bgcolor: 'rgba(67, 233, 123, 0.2)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                        <Work sx={{ fontSize: 40, color: '#43E97B' }} />
                      </Box>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Book Service</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Find professionals for your home repairs.</Typography>
                    </Paper>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={4}>
                    <Paper
                      onClick={() => setActiveView('workerProfile')}
                      sx={{
                        ...glassStyle,
                        p: 4,
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <Box sx={{ bgcolor: 'rgba(67, 233, 123, 0.2)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                        <Work sx={{ fontSize: 40, color: '#43E97B' }} />
                      </Box>
                      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>Worker Profile</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>Update your skills and availability.</Typography>
                    </Paper>
                  </Grid>
                )}

                <Grid item xs={12} md={4}>
                  <Paper
                    onClick={() => navigate('/my-bookings')}
                    sx={{
                      ...glassStyle,
                      p: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 15px 35px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    <Box sx={{ bgcolor: 'rgba(255, 107, 0, 0.2)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', mb: 2 }}>
                      <ShoppingCart sx={{ fontSize: 40, color: '#FF6B00' }} />
                    </Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>My Bookings</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>View your active and past service requests.</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>

          <Fade in={!!activeView} timeout={500}>
            <Box display={!!activeView ? 'block' : 'none'}>
              <Paper
                sx={{
                  ...glassStyle,
                  mt: 2,
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: 'white' }}>
                    {activeView === 'profile' ? 'Personal Information' : 'Worker Profile Setup'}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setActiveView(null)}
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.5)',
                      '&:hover': { borderColor: 'white', background: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Back to Dashboard
                  </Button>
                </Box>

                <Box sx={{ p: 4 }}>
                  {activeView === 'profile' && (
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Full Name</Typography>
                          <Typography variant="h6" sx={{ color: 'white' }}>{user?.name}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Email Address</Typography>
                          <Typography variant="h6" sx={{ color: 'white' }}>{user?.email}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Phone Number</Typography>
                          <Typography variant="h6" sx={{ color: 'white' }}>{user?.phone || 'Not provided'}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Account Role</Typography>
                          <Typography variant="h6" sx={{ color: 'white', textTransform: 'capitalize' }}>{user?.role}</Typography>
                        </Box>
                        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />
                      </Grid>
                    </Grid>
                  )}

                  {activeView === 'workerProfile' && user?.role === 'worker' && (
                    <form onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            select
                            label="Profession"
                            name="profession"
                            value={formData.profession}
                            onChange={handleChange}
                            required
                            sx={inputStyle}
                          >
                            <MenuItem value="electrician">Electrician</MenuItem>
                            <MenuItem value="plumber">Plumber</MenuItem>
                            <MenuItem value="carpenter">Carpenter</MenuItem>
                            <MenuItem value="painter">Painter</MenuItem>
                            <MenuItem value="mason">Mason</MenuItem>
                            <MenuItem value="cleaner">Cleaner</MenuItem>
                          </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Years of Experience"
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            required
                            sx={inputStyle}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            required
                            sx={inputStyle}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Hourly Rate (Rs.)"
                            name="hourlyRate"
                            type="number"
                            value={formData.hourlyRate}
                            onChange={handleChange}
                            required
                            sx={inputStyle}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="City"
                            name="city"
                            value={formData.location.city}
                            onChange={handleChange}
                            required
                            sx={inputStyle}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Skills (comma separated)"
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            helperText="e.g., Wiring, Repair, Installation"
                            sx={{
                              ...inputStyle,
                              '& .MuiFormHelperText-root': {
                                color: 'rgba(255,255,255,0.6)'
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            sx={{
                              px: 4, py: 1.5,
                              background: 'linear-gradient(45deg, #43E97B 0%, #38F9D7 100%)',
                              color: '#000',
                              fontWeight: 'bold',
                              '&:hover': {
                                boxShadow: '0 0 15px rgba(67, 233, 123, 0.6)'
                              }
                            }}
                          >
                            {workerProfile ? 'Update Profile' : 'Create Profile'}
                          </Button>
                          {workerProfile && (
                            <Button
                              variant="outlined"
                              size="large"
                              onClick={() => navigate(`/workers/${user.id}`)}
                              sx={{
                                ml: 2, px: 4, py: 1.5,
                                color: 'white',
                                borderColor: 'white',
                                '&:hover': {
                                  background: 'rgba(255,255,255,0.1)',
                                  borderColor: 'white'
                                }
                              }}
                            >
                              View Public Profile
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </form>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;