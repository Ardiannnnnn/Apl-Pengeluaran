import { useMemo } from 'react';
import { Category, Expense } from '../services/firebaseService';
import { DateFilterMode, getTargetDate } from '../utils/dateUtils';

interface AnalyticsData {
  today: number;
  thisWeek: number; // ✅ NEW: Add thisWeek
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
    
    // ✅ TODAY: Always use actual today (not selectedDate for analytics)
    const actualToday = new Date();
    const startOfToday = new Date(actualToday);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(actualToday);
    endOfToday.setHours(23, 59, 59, 999);

    const todayExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfToday && expenseDate <= endOfToday;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ THIS WEEK: Monday to Sunday of current week
    const getThisWeek = () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Get Monday of this week

      const monday = new Date(today);
      monday.setDate(today.getDate() + mondayOffset);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      return { start: monday, end: sunday };
    };

    const { start: weekStart, end: weekEnd } = getThisWeek();
    const thisWeekExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= weekStart && expenseDate <= weekEnd;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ THIS MONTH: 1st to last day of current month
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ LAST MONTH: Previous month
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ DAILY AVERAGE: Based on actual calendar days with expenses this month
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
    console.log('📊 Analytics calculation (Calendar-based):', {
      selectedCategory: selectedCategory?.name || 'All',
      dateMode: dateFilterMode,
      actualToday: actualToday.toDateString(),
      weekRange: `${weekStart.toDateString()} - ${weekEnd.toDateString()}`,
      monthRange: `${startOfThisMonth.toDateString()} - ${endOfThisMonth.toDateString()}`,
      today: todayExpenses,
      thisWeek: thisWeekExpenses, // ✅ NEW
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      daysWithExpenses,
      dailyAverage,
      filteredExpensesCount: filteredExpenses.length,
    });

    return {
      today: todayExpenses,
      thisWeek: thisWeekExpenses, // ✅ NEW
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      dailyAverage,
      targetDate,
    };
  }, [expenses, selectedCategory, dateFilterMode, selectedDate]);
};