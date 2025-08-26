import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  onSnapshot,
  Timestamp
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

// CRUD Operations for Expenses
export const expenseService = {
  // Create - Add new expense
  create: async (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expense,
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
        expenses.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        } as Expense);
      });
      
      console.log('✅ Fetched expenses:', expenses.length);
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
        expenses.push({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate() || new Date(),
        } as Expense);
      });
      callback(expenses);
    });
  },

  // Update - Update existing expense
  update: async (id: string, updates: Partial<Expense>) => {
    try {
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ Expense updated:', id);
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