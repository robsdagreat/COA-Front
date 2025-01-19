import { useEffect, useState } from 'react';
import { 
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { AccountsAPI, VisualizationAPI } from '../Services/Api';
import { Account, SpendingData, BudgetAlert } from '../Services/Api';

const Dashboard = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [spendingTrend, setSpendingTrend] = useState<SpendingData[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsRes, trendRes, alertsRes] = await Promise.all([
          AccountsAPI.getAll(),
          VisualizationAPI.getSpendingTrend(),
          VisualizationAPI.getBudgetAlerts()
        ]);
        setAccounts(accountsRes.data);
        setSpendingTrend(trendRes.data);
        setBudgetAlerts(alertsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const monthlyChange = spendingTrend.length >= 2 
    ? ((spendingTrend[spendingTrend.length - 1].amount - spendingTrend[spendingTrend.length - 2].amount) / spendingTrend[spendingTrend.length - 2].amount) * 100 
    : 0;

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>

      {budgetAlerts.map((alert, index) => (
        <Alert 
          key={index}
          severity="warning"
          icon={<AlertTriangle />}
          sx={{ mb: 2 }}
          action={
            <IconButton color="inherit" size="small">
              <AlertTriangle />
            </IconButton>
          }
        >
          {alert.message}
        </Alert>
      ))}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            boxShadow: theme.shadows[2],
            background: theme.palette.primary.main,
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Total Balance
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                ${totalBalance.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            boxShadow: theme.shadows[2],
            background: monthlyChange >= 0 ? theme.palette.success.main : theme.palette.error.main,
            color: 'white'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Monthly Change
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {monthlyChange >= 0 ? <TrendingUp /> : <TrendingDown />}
                <Typography variant="h4" sx={{ fontWeight: 500, ml: 1 }}>
                  {Math.abs(monthlyChange).toFixed(1)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {accounts.map(account => (
          <Grid item xs={12} md={4} key={account.id}>
            <Card sx={{ 
              height: '100%',
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
                transition: 'box-shadow 0.3s ease-in-out'
              }
            }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {account.name}
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 500
                }}>
                  ${account.balance.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ boxShadow: theme.shadows[2] }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Spending Trend
          </Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart 
                data={spendingTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: isMobile ? 12 : 14 }}
                />
                <YAxis
                  tick={{ fontSize: isMobile ? 12 : 14 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Amount']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;