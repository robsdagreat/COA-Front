// api.ts

// Type definitions
export interface LoginResponse {
    token: string;
  }
  
  export interface Account {
    id: string;
    name: string;
    balance: number;
    createdAt: string;
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    type: 'Income' | 'Expense';
    categoryId: string;
    accountId: string;
    date: string;
    description?: string;
    category?: Category;
  }
  
  export interface Category {
    id: string;
    name: string;
    parentId?: string;
    type: 'Income' | 'Expense';
  }
  
  interface Budget {
    id: string;
    accountId: string;
    limit: number;
    period: 'monthly' | 'yearly'; 
    currentSpending: number;
  }
  
  
  export interface SpendingData {
    month: string;
    amount: number;
  }
  
  export interface BudgetAlert {
    accountId: string;
    message: string;
    severity: 'warning' | 'error';
    threshold: number;
  }
  
  // Helper function to handle API requests
  const apiRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T }> => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
  
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });
  
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
  
    const data = await response.json();
    return { data };
  };
  
  // Auth API
  export const AuthAPI = {
    login: async (email: string, password: string) => {
      return apiRequest<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  
    logout: async () => {
      return apiRequest('/logout', { method: 'POST' });
    },
  };
  
  // Accounts API
  export const AccountsAPI = {
    getAll: async () => {
      return apiRequest<Account[]>('/accounts');
    },
  
    getById: async (id: string) => {
      return apiRequest<Account>(`/accounts/${id}`);
    },
  
    create: async (accountData: Omit<Account, 'id' | 'createdAt'>) => {
      return apiRequest<Account>('/accounts', {
        method: 'POST',
        body: JSON.stringify(accountData),
      });
    },
  
    update: async (id: string, accountData: Partial<Account>) => {
      return apiRequest<Account>(`/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(accountData),
      });
    },
  
    delete: async (id: string) => {
      return apiRequest(`/accounts/${id}`, { method: 'DELETE' });
    },
  };
  
  // Transactions API
  export const TransactionsAPI = {
    getAll: async () => {
      return apiRequest<Transaction[]>('/transactions');
    },
  
    getByDateRange: async (startDate?: string, endDate?: string) => {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      return apiRequest<Transaction[]>(`/transactions?${queryParams}`);
    },
  
    create: async (transactionData: Omit<Transaction, 'id'>) => {
      return apiRequest<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
    },
  
    update: async (id: string, transactionData: Partial<Transaction>) => {
      return apiRequest<Transaction>(`/transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData),
      });
    },
  
    delete: async (id: string) => {
      return apiRequest(`/transactions/${id}`, { method: 'DELETE' });
    },
  };
  
  // Categories API
  export const CategoriesAPI = {
    getAll: async () => {
      return apiRequest<Category[]>('/categories');
    },
  
    create: async (categoryData: Omit<Category, 'id'>) => {
      return apiRequest<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      });
    },
  
    update: async (id: string, categoryData: Partial<Category>) => {
      return apiRequest<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData),
      });
    },
  
    delete: async (id: string) => {
      return apiRequest(`/categories/${id}`, { method: 'DELETE' });
    },
  };
  
  // Budgets API
  export const BudgetsAPI = {
    get: async (accountId: string) => {
      return apiRequest<Budget>(`/budgets/${accountId}`);
    },
  
    set: async (budgetData: Omit<Budget, 'id' | 'currentSpending'>) => {
      return apiRequest<Budget>('/budgets', {
        method: 'POST',
        body: JSON.stringify(budgetData),
      });
    },
  
    update: async (id: string, budgetData: Partial<Budget>) => {
      return apiRequest<Budget>(`/budgets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(budgetData),
      });
    },
  };
  
  // Visualization API
  export const VisualizationAPI = {
    getSpendingTrend: async (period: 'monthly' | 'yearly' = 'monthly') => {
      return apiRequest<SpendingData[]>(`/visualizations/spending-trend?period=${period}`);
    },
  
    getBudgetAlerts: async () => {
      return apiRequest<BudgetAlert[]>('/visualizations/budget-alerts');
    },
  
    getCategoryDistribution: async (startDate?: string, endDate?: string) => {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      return apiRequest<Array<{ category: string; amount: number }>>(`/visualizations/category-distribution?${queryParams}`);
    },
  };