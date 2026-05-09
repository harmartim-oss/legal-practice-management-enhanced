import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Expense {
  id: string;
  matterId: string;
  clientId: string;
  description: string;
  amount: number;
  category: 'court-fees' | 'filing-fees' | 'expert-fees' | 'travel' | 'disbursements' | 'other';
  date: Date;
  taxable: boolean; // Whether HST applies
  notes?: string;
  createdAt: Date;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByMatter: (matterId: string) => Expense[];
  getExpensesByClient: (clientId: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setExpenses(parsed.map((e: any) => ({
          ...e,
          date: new Date(e.date),
          createdAt: new Date(e.createdAt)
        })));
      } catch (error) {
        console.error('Failed to load expenses:', error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `exp-${Date.now()}`,
      createdAt: new Date()
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(expenses.map(e => 
      e.id === id ? { ...e, ...updates } : e
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const getExpensesByMatter = (matterId: string) => {
    return expenses.filter(e => e.matterId === matterId);
  };

  const getExpensesByClient = (clientId: string) => {
    return expenses.filter(e => e.clientId === clientId);
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      updateExpense,
      deleteExpense,
      getExpensesByMatter,
      getExpensesByClient
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within ExpenseProvider');
  }
  return context;
}
