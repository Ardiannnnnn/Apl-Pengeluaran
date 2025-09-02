import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from '../FirebaseConfig';

export interface Expense {
  id?: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  icon: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Category {
  id?: string;
  name: string;
  icon: string;
  color: string;
  iconColor: string;
}

// ✅ Helper function for consistent date conversion
const convertToDate = (dateValue: any): Date => {
  if (!dateValue) return new Date();
  
  // If it's already a Date object
  if (dateValue instanceof Date) return dateValue;
  
  // If it's a Firestore Timestamp
  if (dateValue?.toDate) return dateValue.toDate();
  
  // If it's a string (ISO format)
  if (typeof dateValue === 'string') return new Date(dateValue);
  
  // Fallback to current date
  return new Date();
};

// ✅ Helper function to save date consistently
const convertFromDate = (date: Date): string => {
  // Ensure we save as ISO string without timezone issues
  return date.toISOString();
};

// CRUD Operations for Expenses
export const expenseService = {
  // Create - Add new expense
  create: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        icon: expense.icon,
        date: convertFromDate(expense.date), // ✅ Consistent date conversion
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      console.log('✅ Expense created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating expense:', error);
      throw error;
    }
  },

  // Read - Get all expenses
  getAll: async (): Promise<Expense[]> => {
    try {
      const q = query(
        collection(db, 'expenses'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // ✅ Debug log for each expense
        console.log('📄 Raw expense data:', {
          id: doc.id,
          title: data.title,
          amount: data.amount,
          rawDate: data.date,
          dateType: typeof data.date,
        });
        
        const expense: Expense = {
          id: doc.id,
          title: data.title,
          amount: data.amount,
          category: data.category,
          icon: data.icon,
          date: convertToDate(data.date), // ✅ Consistent date conversion
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        
        // ✅ Debug log for converted expense
        console.log('✅ Converted expense:', {
          id: expense.id,
          title: expense.title,
          amount: expense.amount,
          convertedDate: expense.date.toISOString(),
          dateString: expense.date.toDateString(),
        });
        
        expenses.push(expense);
      });
      
      console.log('✅ Total fetched expenses:', expenses.length);
      return expenses;
    } catch (error) {
      console.error('❌ Error fetching expenses:', error);
      throw error;
    }
  },

  // Read - Real-time listener
  subscribe: (callback: (expenses: Expense[]) => void) => {
    const q = query(
      collection(db, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const expenses: Expense[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        const expense: Expense = {
          id: doc.id,
          title: data.title,
          amount: data.amount,
          category: data.category,
          icon: data.icon,
          date: convertToDate(data.date), // ✅ Consistent date conversion
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };
        
        expenses.push(expense);
      });
      
      console.log('🔄 Real-time update: received', expenses.length, 'expenses');
      callback(expenses);
    });
  },

  // ✅ Update - Handle Date conversion consistently
  update: async (id: string, expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      const expenseRef = doc(db, 'expenses', id);
      
      // ✅ Prepare update data with consistent date conversion
      const updateData = {
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        icon: expense.icon,
        date: expense.date.toISOString(), // ✅ Consistent date conversion
        updatedAt: serverTimestamp(),
      };
      
      console.log('📝 Updating expense:', {
        id,
        title: expense.title,
        amount: expense.amount,
        originalDate: expense.date,
        convertedDate: updateData.date,
      });
      
      await updateDoc(expenseRef, updateData);
      console.log('✅ Expense updated successfully:', id);
    } catch (error) {
      console.error('❌ Error updating expense:', error);
      throw error;
    }
  },

  // Delete - Remove expense
  delete: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'expenses', id));
      console.log('✅ Expense deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting expense:', error);
      throw error;
    }
  },
};

// CRUD Operations for Categories
export const categoryService = {
  // Get all categories
  getAll: async (): Promise<Category[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categories: Category[] = [];
      
      querySnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data(),
        } as Category);
      });
      
      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  },

  // Create new category
  create: async (category: Omit<Category, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'categories'), category);
      console.log('✅ Category created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating category:', error);
      throw error;
    }
  },
};