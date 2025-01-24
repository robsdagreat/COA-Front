import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, TextField, Button, Typography, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { AccountsAPI, BudgetsAPI } from '../Services/Api';

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface Budget {
  accountId: number;
  limit: number;
  period: 'monthly' | 'yearly';
}

interface BudgetAlert {
  budgetLimit: number;
  totalExpenses: number;
  remainingBudget: number;
  isExceeded: boolean;
  percentageUsed: number;
}

export default function Settings() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState({ name: '', balance: 0 });
  const [newBudget, setNewBudget] = useState<Budget>({
    accountId: 0,
    limit: 0,
    period: 'monthly',
  });
  const [budgetAlert, setBudgetAlert] = useState<BudgetAlert | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await AccountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      setError('Failed to fetch accounts');
      console.error(error);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AccountsAPI.create({
        name: newAccount.name,
        balance: Number(newAccount.balance)
      });
      await fetchAccounts();
      setNewAccount({ name: '', balance: 0 });
    } catch (error) {
      setError('Failed to create account');
      console.error(error);
    }
  };

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (newBudget.period === 'monthly' ? 1 : 12));

      await BudgetsAPI.set({
        accountId: Number(newBudget.accountId),
        limit: Number(newBudget.limit),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      // Check budget status after setting
      const budgetStatus = await BudgetsAPI.check(Number(newBudget.accountId));
      setBudgetAlert(budgetStatus.data);

      setNewBudget({
        accountId: 0,
        limit: 0,
        period: 'monthly'
      });
    } catch (error) {
      setError('Failed to set budget');
      console.error(error);
    }
  };

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Settings</Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {budgetAlert && budgetAlert.isExceeded && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Budget exceeded! Used: {budgetAlert.percentageUsed.toFixed(1)}%
          Remaining: {budgetAlert.remainingBudget.toFixed(2)}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardHeader title="Add Account" />
        <CardContent>
          <form onSubmit={handleAddAccount}>
            <TextField
              fullWidth
              label="Account Name"
              value={newAccount.name}
              onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Initial Balance"
              type="number"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained">Add Account</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Set Budget" />
        <CardContent>
          <form onSubmit={handleSetBudget}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Select Account</InputLabel>
              <Select
                value={newBudget.accountId}
                onChange={(e) => setNewBudget({ ...newBudget, accountId: Number(e.target.value) })}
                label="Select Account"
              >
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
              value={newBudget.limit}
              onChange={(e) => setNewBudget({ ...newBudget, limit: Number(e.target.value) })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Budget Period</InputLabel>
              <Select
                value={newBudget.period}
                onChange={(e) => setNewBudget({ ...newBudget, period: e.target.value as 'monthly' | 'yearly' })}
                label="Budget Period"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">Set Budget</Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}