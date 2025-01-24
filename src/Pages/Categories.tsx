import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Grid,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { Edit, Add, Delete } from '@mui/icons-material';
import { AccountsAPI, CategoriesAPI, HierarchicalCategory, Category } from '../Services/Api';

interface Account {
  id: number;
  name: string;
  balance: number;
}

export default function CategoriesPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [categoriesForAccount, setCategoriesForAccount] = useState<HierarchicalCategory[]>([]);
  
  // Dialog states
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await AccountsAPI.getAll();
      setAccounts(response.data);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    }
  };

  const handleAccountSelect = async (account: Account) => {
    setSelectedAccount(account);
    try {
      const categoriesResponse = await CategoriesAPI.getByAccount(account.id);
      setCategoriesForAccount(categoriesResponse.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleOpenCategoryDialog = (category?: HierarchicalCategory) => {
    setEditingCategory(category ? { 
      id: category.id, 
      name: category.name, 
      parentCategoryId: category.parentCategoryId 
    } : { 
      name: '', 
      parentCategoryId: undefined 
    });
    setOpenCategoryDialog(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (!selectedAccount) return;

      if (editingCategory?.id) {
        // Update existing category
        await CategoriesAPI.update(editingCategory.id, editingCategory);
      } else {
        // Create new category
        await CategoriesAPI.create({
          name: editingCategory?.name || '',
          parentCategoryId: editingCategory?.parentCategoryId,
          accountId: selectedAccount.id
        });
      }

      // Refresh categories
      const categoriesResponse = await CategoriesAPI.getByAccount(selectedAccount.id);
      setCategoriesForAccount(categoriesResponse.data);
      
      setOpenCategoryDialog(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await CategoriesAPI.delete(categoryId);
      
      // Refresh categories if an account is selected
      if (selectedAccount) {
        const categoriesResponse = await CategoriesAPI.getByAccount(selectedAccount.id);
        setCategoriesForAccount(categoriesResponse.data);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const renderCategoryHierarchy = (categories: HierarchicalCategory[]) => (
    <List>
      {categories.map((category) => (
        <React.Fragment key={category.id}>
          <ListItem
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleOpenCategoryDialog(category)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDeleteCategory(category.id)}>
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText 
              primary={category.name} 
              primaryTypographyProps={{ fontWeight: 'bold' }}
            />
          </ListItem>
          {category.children && category.children.length > 0 && (
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {renderCategoryHierarchy(category.children)}
            </List>
          )}
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Account Categories
      </Typography>

      <Grid container spacing={3}>
        {accounts.map((account) => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card 
              sx={{ 
                cursor: 'pointer', 
                transition: 'transform 0.2s',
                '&:hover': { 
                  transform: 'scale(1.05)',
                  boxShadow: 3 
                },
                backgroundColor: selectedAccount?.id === account.id 
                  ? 'primary.light' 
                  : 'background.paper'
              }}
              onClick={() => handleAccountSelect(account)}
            >
              <CardHeader 
                title={account.name}
                subheader={`Balance: $${account.balance.toFixed(2)}`}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      <Collapse in={!!selectedAccount} unmountOnExit>
        <Card sx={{ mt: 3 }}>
          <CardHeader 
            title={`Categories for ${selectedAccount?.name}`} 
            titleTypographyProps={{ variant: 'h6' }}
            action={
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                onClick={() => handleOpenCategoryDialog()}
              >
                Add Category
              </Button>
            }
          />
          <CardContent>
            {categoriesForAccount.length > 0 ? (
              renderCategoryHierarchy(categoriesForAccount)
            ) : (
              <Typography color="textSecondary">
                No categories found for this account.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Collapse>

      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>
          {editingCategory?.id ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={editingCategory?.name || ''}
            onChange={(e) => setEditingCategory(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2, mt: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Parent Category (Optional)</InputLabel>
            <Select
              value={editingCategory?.parentCategoryId || ''}
              onChange={(e) => setEditingCategory(prev => ({ 
                ...prev, 
                parentCategoryId: e.target.value ? Number(e.target.value) : undefined 
              }))}
            >
              <MenuItem value="">None</MenuItem>
              {categoriesForAccount.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveCategory} 
            color="primary" 
            disabled={!editingCategory?.name}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}