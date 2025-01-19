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
  FormControl, 
  InputLabel, 
  Grid 
} from '@mui/material';
import { TransactionsAPI, CategoriesAPI } from '../Services/Api';
import { Transaction } from '../Services/Api';


export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    amount: 0,
    type: 'Expense',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
});
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactionsRes, categoriesRes] = await Promise.all([
          TransactionsAPI.getByDateRange(),
          CategoriesAPI.getAll(),
        ]);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await TransactionsAPI.create(newTransaction);
      const res = await TransactionsAPI.getByDateRange();
      setTransactions(res.data);
      setNewTransaction({
        amount: 0,
        type: 'Expense',
        categoryId: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  return (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Transactions
      </Typography>

      <Card sx={{ mb: 4, boxShadow: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h6" fontWeight="bold">
              Add Transaction
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              variant="outlined"
              value={newTransaction.amount}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) || 0 })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={newTransaction.type}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, type: e.target.value as 'Income' | 'Expense'  })
                }
                label="Type"
              >
                <MenuItem value="Expense">Expense</MenuItem>
                <MenuItem value="Income">Income</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={newTransaction.categoryId}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, categoryId: e.target.value })
                }
                label="Category"
              >
                <MenuItem value="">
                  <em>Select Category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Date"
              type="date"
              variant="outlined"
              value={newTransaction.date}
              onChange={(e) =>
                setNewTransaction({ ...newTransaction, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Add Transaction
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 2 }}>
        <CardHeader 
          title={
            <Typography variant="h6" fontWeight="bold">
              Recent Transactions
            </Typography>
          }
          sx={{ pb: 0 }}
        />
        <CardContent>
          <Grid container spacing={2}>
            {transactions.map((transaction) => (
              <Grid item xs={12} key={transaction.id}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    border: 1,
                    borderRadius: 1,
                    borderColor: 'grey.300',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {transaction.category?.name || 'Uncategorized'}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      {new Date(transaction.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color:
                        transaction.type === 'Income'
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {transaction.type === 'Income' ? '+' : '-'}$
                    {transaction.amount}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
