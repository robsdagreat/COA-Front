import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  TextField, 
  Button, 
  Typography, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl 
} from '@mui/material';
import { AccountsAPI, BudgetsAPI } from '../Services/Api';

// Add type definitions
interface Account {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
}

interface Budget {
    id?: string;
    accountId: string;
    limit: number;
    period: 'monthly' | 'yearly';
    currentSpending: number;
  }
  
  

export default function Settings() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState({
    name: '',
    balance: 0
  });
  const [newBudget, setNewBudget] = useState<Budget>({
    accountId: '',
    limit: 0,
    period: 'monthly', 
    currentSpending: 0, 
  });
  
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await AccountsAPI.getAll();
        setAccounts(response.data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
    fetchAccounts();
  }, []);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AccountsAPI.create({
        name: newAccount.name,
        balance: Number(newAccount.balance) // Ensure number type
      });
      const response = await AccountsAPI.getAll();
      setAccounts(response.data);
      setNewAccount({ name: '', balance: 0 });
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await BudgetsAPI.set({
        accountId: newBudget.accountId,
        limit: Number(newBudget.limit), // Ensure number type
        period: newBudget.period
      });
      setNewBudget({
        accountId: '',
        limit: 0,
        period: 'monthly',  // Default value
        currentSpending: 0  // Default value
      });
    } catch (error) {
      console.error('Failed to set budget:', error);
    }
  };
  
  
  

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Settings
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h6" fontWeight="bold">
              Add Account
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <form onSubmit={handleAddAccount}>
            <TextField
              fullWidth
              label="Account Name"
              variant="outlined"
              value={newAccount.name}
              onChange={(e) =>
                setNewAccount({ ...newAccount, name: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Initial Balance"
              type="number"
              variant="outlined"
              value={newAccount.balance}
              onChange={(e) =>
                setNewAccount({ ...newAccount, balance: Number(e.target.value) })
              }
              sx={{ mb: 2 }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Add Account
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h6" fontWeight="bold">
              Set Budget
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <form onSubmit={handleSetBudget}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Account</InputLabel>
              <Select
                value={newBudget.accountId}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, accountId: e.target.value })
                }
                label="Select Account"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Budget Limit"
              type="number"
              variant="outlined"
              value={newBudget.limit}
              onChange={(e) =>
                setNewBudget({ ...newBudget, limit: Number(e.target.value) })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Budget Period</InputLabel>
              <Select
                value={newBudget.period}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, period: e.target.value as 'monthly' | 'yearly'  })
                }
                label="Budget Period"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
            >
              Set Budget
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}