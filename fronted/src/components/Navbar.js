import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  HomeRepairService,
  Dashboard,
  BookOnline,
  Login,
  PersonAdd,
  Menu as MenuIcon,
  Logout,
  Person,
  History,
  Work,
  ArrowBack,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const navItems = [];
  if (!user) {
    navItems.push({ label: 'Find Workers', path: '/workers', icon: <Work /> });
  } else if (user.role === 'customer') {
    navItems.push({ label: 'Find Workers', path: '/workers', icon: <Work /> });
    navItems.push({ label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> });
    navItems.push({ label: 'My Bookings', path: '/my-bookings', icon: <History /> });
  } else if (user.role === 'worker') {
    navItems.push({ label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> });
    navItems.push({ label: 'My Bookings', path: '/my-bookings', icon: <History /> });
  } else if (user.role === 'admin') {
    navItems.push({ label: 'Admin Portal', path: '/admin', icon: <Person /> });
  }

  const drawerContent = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, px: 2 }}>
        <HomeRepairService sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
        <Typography variant="h6" fontWeight={800} color="primary">
          GharFix
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {!user ? (
          <>
            <ListItem button onClick={() => { navigate('/login'); setDrawerOpen(false); }} sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button onClick={() => { navigate('/register'); setDrawerOpen(false); }} sx={{ borderRadius: 2 }}>
              <ListItemIcon><PersonAdd /></ListItemIcon>
              <ListItemText primary="Sign Up" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
            <ListItemIcon><Logout color="error" /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate(-1)} edge="start" color="primary" sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            <Box
              component={Link}
              to="/"
              sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', cursor: 'pointer' }}
            >
              <HomeRepairService sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
              <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: theme.palette.primary.main,
                letterSpacing: '-0.5px',
              }}
            >
              GharFix
            </Typography>
            </Box>
          </Box>

          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  color="primary"
                  component={Link}
                  to={item.path}
                  sx={{ fontWeight: 600 }}
                >
                  {item.label}
                </Button>
              ))}

              {user ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleMenuOpen}
                    sx={{ borderRadius: 2, display: 'flex', gap: 1 }}
                  >
                    <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main }}>
                      {user.name?.[0]}
                    </Avatar>
                    {user.name}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {user?.role !== 'admin' && (
                      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        Profile
                      </MenuItem>
                    )}
                    {user?.role !== 'admin' && (
                      <MenuItem onClick={() => { navigate('/my-bookings'); handleMenuClose(); }}>
                        <ListItemIcon><BookOnline fontSize="small" /></ListItemIcon>
                        My Bookings
                      </MenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
                        <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                        Admin Portal
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button variant="outlined" component={Link} to="/login" sx={{ borderRadius: 2 }}>
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(46, 125, 50, 0.39)',
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;