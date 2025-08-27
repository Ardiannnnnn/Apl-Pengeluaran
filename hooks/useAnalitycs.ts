import { useMemo } from 'react';
import { Category, Expense } from '../services/firebaseService';
import { DateFilterMode, getTargetDate } from '../utils/dateUtils';

interface AnalyticsData {
  today: number;
  thisMonth: number;
  lastMonth: number;
  dailyAverage: number;
  targetDate: Date;
}

export const useAnalytics = (
  expenses: Expense[],
  selectedCategory: Category | null,
  dateFilterMode: DateFilterMode,
  selectedDate: Date
): AnalyticsData => {
  return useMemo(() => {
    const now = new Date();
    
    // Filter by selected category first
    let filteredExpenses = selectedCategory 
      ? expenses.filter(expense => expense.category === selectedCategory.name)
      : expenses;

    const targetDate = getTargetDate(dateFilterMode, selectedDate);
    
    // Today's calculation (based on selected date)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const todayExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfDay && expenseDate <= endOfDay;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // This month's calculation
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // Last month's calculation
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ FIXED: Daily average calculation
    // Get expenses for this month
    const thisMonthExpensesList = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
    });

    // Group expenses by date to count unique days with expenses
    const expensesByDate = new Map<string, number>();
    
    thisMonthExpensesList.forEach(expense => {
      const dateKey = new Date(expense.date).toDateString();
      const currentTotal = expensesByDate.get(dateKey) || 0;
      expensesByDate.set(dateKey, currentTotal + expense.amount);
    });

    // Calculate daily average based on actual days with expenses
    const daysWithExpenses = expensesByDate.size;
    const dailyAverage = daysWithExpenses > 0 ? Math.round(thisMonthExpenses / daysWithExpenses) : 0;

    // Debug logs
    console.log('📊 Analytics calculation:', {
      selectedCategory: selectedCategory?.name || 'All',
      dateMode: dateFilterMode,
      targetDate: targetDate.toDateString(),
      today: todayExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      daysWithExpenses, // ✅ NEW: Show actual days with expenses
      dailyAverage,
      expensesByDate: Array.from(expensesByDate.entries()), // ✅ NEW: Show breakdown
      filteredExpensesCount: filteredExpenses.length,
    });

    return {
      today: todayExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      dailyAverage,
      targetDate,
    };
  }, [expenses, selectedCategory, dateFilterMode, selectedDate]);
};