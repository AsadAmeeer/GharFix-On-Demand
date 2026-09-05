import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Person, Work, VerifiedUser, Star } from '@mui/icons-material';
import API from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState(null);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, workersRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/workers'),
      ]);
      setUsers(usersRes.data);
      setWorkers(workersRes.data);
    } catch (err) {
      setError('Failed to fetch admin data. Are you sure you are an admin?');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (workerProfileId) => {
    try {
      await API.put(`/admin/workers/${workerProfileId}/verify`);
      setWorkers(workers.map(w => w._id === workerProfileId ? { ...w, verified: true } : w));
    } catch (err) {
      setError('Failed to verify worker.');
    }
  };

  const handleRemove = async (workerProfileId) => {
    if (!window.confirm("Are you sure you want to remove this worker? Their role will be reverted to Customer.")) return;
    try {
      await API.delete(`/admin/workers/${workerProfileId}`);
      setWorkers(workers.filter(w => w._id !== workerProfileId));
    } catch (err) {
      setError('Failed to remove worker.');
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
    <>
      <Navbar />
      <Box sx={{ py: 6, minHeight: 'calc(100vh - 64px)', bgcolor: '#f4f6f8' }}>
        <Box 
          sx={{
            height: '200px',
            background: 'linear-gradient(135deg, #1A2980 0%, #26D0CE 100%)',
            position: 'absolute',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 0
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1, mt: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'white' }}>
            Admin Portal
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

          {!activeView ? (
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Paper 
                  onClick={() => setActiveView('customers')} 
                  sx={{ p: 4, textAlign: 'center', cursor: 'pointer', borderRadius: 4, '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}
                >
                  <Person sx={{ fontSize: 60, color: '#1a2980', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>Registered Customers</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{users.filter(u => u.role === 'customer').length} Total</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  onClick={() => setActiveView('workers')} 
                  sx={{ p: 4, textAlign: 'center', cursor: 'pointer', borderRadius: 4, '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}
                >
                  <Work sx={{ fontSize: 60, color: '#26d0ce', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>Registered Workers</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{workers.filter(w => w.verified).length} Verified</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  onClick={() => setActiveView('verification')} 
                  sx={{ p: 4, textAlign: 'center', cursor: 'pointer', borderRadius: 4, '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }, transition: 'all 0.3s' }}
                >
                  <VerifiedUser sx={{ fontSize: 60, color: '#FF6B00', mb: 2 }} />
                  <Typography variant="h5" fontWeight={700}>Worker Verification</Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>{workers.filter(w => !w.verified).length} Pending</Typography>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper 
              elevation={24} 
              sx={{ 
                mt: 3, 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{ p: 3, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight={700}>
                  {activeView === 'customers' && 'All Customers'}
                  {activeView === 'workers' && 'All Workers'}
                  {activeView === 'verification' && 'Worker Verifications'}
                </Typography>
                <Button variant="outlined" onClick={() => setActiveView(null)}>Back to Overview</Button>
              </Box>

              <Box sx={{ p: 3 }}>
                {activeView === 'customers' && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Name</strong></TableCell>
                          <TableCell><strong>Email</strong></TableCell>
                          <TableCell><strong>Phone</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.filter(u => u.role === 'customer').map((u) => (
                          <TableRow key={u._id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>{u.phone}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {(activeView === 'workers' || activeView === 'verification') && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Worker Name</strong></TableCell>
                          <TableCell><strong>Profession</strong></TableCell>
                          <TableCell><strong>Feedback Rating</strong></TableCell>
                          <TableCell><strong>Status</strong></TableCell>
                          <TableCell><strong>Action</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {workers
                          .filter(w => activeView === 'workers' ? w.verified : !w.verified)
                          .map((w) => (
                          <TableRow key={w._id}>
                            <TableCell>{w.userId?.name}</TableCell>
                            <TableCell>
                              <Chip label={w.profession} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Star sx={{ fontSize: 18, color: '#FFD700', mr: 0.5 }} />
                                <Typography fontWeight="bold" color={w.averageRating < 3 && w.totalReviews > 0 ? 'error' : 'inherit'}>
                                  {w.averageRating ? w.averageRating.toFixed(1) : 'No rating'}
                                </Typography>
                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                  ({w.totalReviews || 0} reviews)
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={w.verified ? 'Verified' : 'Pending'} 
                                color={w.verified ? 'success' : 'warning'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {!w.verified && (
                                  <Button 
                                    variant="contained" 
                                    color="success" 
                                    size="small" 
                                    onClick={() => handleVerify(w._id)}
                                  >
                                    Verify
                                  </Button>
                                )}
                                <Button 
                                  variant="contained" 
                                  color="error" 
                                  size="small" 
                                  onClick={() => handleRemove(w._id)}
                                >
                                  Remove
                                </Button>
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Paper>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AdminDashboard;
