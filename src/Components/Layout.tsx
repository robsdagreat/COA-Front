import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Wallet, PieChart, Receipt, Settings } from 'lucide-react';
import { Category } from '@mui/icons-material';

interface LayoutProps {
  children: React.ReactNode;
}

const DRAWER_WIDTH = 250;

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <PieChart />, path: '/dashboard' },
    { text: 'Transactions', icon: <Receipt />, path: '/transactions' },
    { text: 'Categories', icon: <Category />, path: '/categories' },
    { text: 'Settings', icon: <Settings />, path: '/settings' }
  ];

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            component={Link} 
            to={item.path}
            sx={{ 
              color: 'inherit', 
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      width: '100%',
      overflow: 'hidden'
    }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'text.primary',
          boxShadow: 1,
          width: '100%'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ mr: 1 }}>
              <Wallet />
            </Box>
            <Typography variant="h6" noWrap component="div">
              Wallet App
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ 
          width: { sm: DRAWER_WIDTH }, 
          flexShrink: { sm: 0 },
          position: 'relative'
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH 
            },
          }}
        >
          {drawer}
        </Drawer>
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
              position: 'fixed',
              height: '100vh',
              top: 0
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: '100%',
          mt: 8,
          backgroundColor: 'grey.100',
          minHeight: '100vh',
          overflow: 'auto',
          position: 'relative',
          marginLeft: { sm: `${DRAWER_WIDTH}px` }
        }}
      >
        {children}
      </Box>
    </Box>
  );
}