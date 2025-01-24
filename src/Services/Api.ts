// api.ts

// Type definitions
export interface LoginResponse {
    token: string;
  }
  
  export interface Account {
    id: number;
    name: string;
    balance: number;
    userId?: string;
  }
  
  export interface Budget {
    id?: number;
    accountId: number;
    limit: number;
    startDate: string;
    endDate: string;
  }
  
  export interface Transaction {
    id?: number;
    accountId: number;
    amount: number;
    date: string;
    description?: string;
    categoryId: number;
    type: 'Income' | 'Expense';
    category?: Category;
  }

  export interface HierarchicalCategory {
    id: number;
    name: string;
    parentCategoryId?: number;
    children?: HierarchicalCategory[];
  }
  
  export interface Category {
    id?: number;
    name: string;
    parentCategoryId?: number;
    accountId?: number;
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
      return apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
  
    signup: async (name: string, email: string, password: string) => {
      return apiRequest<LoginResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
    },
  
    logout: async () => {
      return apiRequest('/auth/logout', {
        method: 'POST',
      });
    },
  };
  
  // Accounts API
  export const AccountsAPI = {
  getAll: async () => {
    return apiRequest<Account[]>('/Account');
  },
  create: async (accountData: Omit<Account, 'id' | 'userId'>) => {
    return apiRequest<Account>('/Account', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }
};
  
  // Transactions API
  export const TransactionsAPI = {
    getAll: async () => {
      return apiRequest<Transaction[]>('/Transactions');
    },
  
    getByDateRange: async (startDate?: string, endDate?: string) => {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      return apiRequest<Transaction[]>(`/Transactions?${queryParams}`);
    },
  
    create: async (transactionData: Omit<Transaction, 'id'>) => {
      return apiRequest<Transaction>('/Transactions', {
        method: 'POST',
        body: JSON.stringify(transactionData),
      });
    },
  
    update: async (id: string, transactionData: Partial<Transaction>) => {
      return apiRequest<Transaction>(`/Transactions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(transactionData),
      });
    },
  
    delete: async (id: string) => {
      return apiRequest(`/Transactions/${id}`, { method: 'DELETE' });
    },
  };
  
  // Categories API
  export const CategoriesAPI = {
    getAll: async () => {
      return apiRequest<Category[]>('/Categories');
    },
  
    getHierarchy: async () => {
      return apiRequest<HierarchicalCategory[]>('/Categories/hierarchy');
    },
  
    getByAccount: async (accountId: number) => {
      return apiRequest<HierarchicalCategory[]>(`/Categories/account/${accountId}`);
    },
  
    create: async (categoryData: Omit<Category, 'id'> & { accountId: number }) => {
      return apiRequest<Category>('/Categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
    },

    delete: async (id: number) => {
      return apiRequest(`/Categories/${id}`, {
        method: 'DELETE'
      });
    },

    update: async (id: number, categoryData: Partial<Category>) => {
      return apiRequest<Category>(`/Categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoryData)
      });
    }
  };
  
  // Budgets API
  export const BudgetsAPI = {
    set: async (budgetData: Omit<Budget, 'id'>) => {
      return apiRequest<Budget>('/Budgets', {
        method: 'POST',
        body: JSON.stringify(budgetData),
      });
    },
    check: async (accountId: number) => {
      return apiRequest<{
        budgetLimit: number;
        totalExpenses: number;
        remainingBudget: number;
        isExceeded: boolean;
        percentageUsed: number;
      }>(`/Budgets/check?accountId=${accountId}`);
    }
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