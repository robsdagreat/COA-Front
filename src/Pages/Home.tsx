import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
} from '@mui/material';
import {
  AccountBalance,
  Assessment,
  Category,
  NotificationsActive,
  ShowChart,
  Timeline,
} from '@mui/icons-material';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AccountBalance fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Track All Transactions',
      description: 'Monitor all your financial movements across multiple accounts including bank, mobile money, and cash.'
    },
    {
      icon: <Assessment fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Custom Reports',
      description: 'Generate detailed financial reports for any time period to better understand your spending patterns.'
    },
    {
      icon: <NotificationsActive fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Budget Alerts',
      description: 'Set spending limits and receive instant notifications when you are approaching or exceeding your budget.'
    },
    {
      icon: <Category fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Smart Categorization',
      description: 'Organize your expenses with custom categories and subcategories for better expense tracking.'
    },
    {
      icon: <Timeline fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Transaction Linking',
      description: 'Link your expenses to specific categories and subcategories for detailed expense analysis.'
    },
    {
      icon: <ShowChart fontSize="large" sx={{ color: '#2e7d32' }} />,
      title: 'Visual Insights',
      description: 'View your financial data through intuitive charts and graphs for better understanding of your finances.'
    }
  ];

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
        m: 0,
        p: 0,
      }}
    >
      {/* Hero Section */}
      <Box 
        sx={{
          width: '100%',
          pt: 8,
          pb: 6,
          px: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' }
          }}
        >
          Smart Wallet Management
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
          sx={{ 
            mb: 4,
            mx: 'auto',
            maxWidth: '800px',
            px: 2
          }}
        >
          Take control of your finances with our comprehensive wallet management solution.
          Track expenses, monitor budgets, and gain insights across all your accounts in one place.
        </Typography>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mb: 8 }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/signup')}
            sx={{ 
              px: 4,
              bgcolor: '#2e7d32',
              '&:hover': {
                bgcolor: '#1b5e20'
              }
            }}
          >
            GET STARTED
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
            sx={{ 
              px: 4,
              color: '#2e7d32',
              borderColor: '#2e7d32',
              '&:hover': {
                borderColor: '#1b5e20',
                color: '#1b5e20'
              }
            }}
          >
            SIGN IN
          </Button>
        </Stack>

        {/* Features Grid */}
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '90%', md: '85%', lg: '80%' },
            mx: 'auto',
          }}
        >
          <Grid 
            container 
            spacing={4}
            justifyContent="center"
            sx={{ 
              px: { xs: 2, sm: 4 }
            }}
          >
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography 
                      gutterBottom 
                      variant="h5" 
                      component="h2"
                      sx={{ fontWeight: 500 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}