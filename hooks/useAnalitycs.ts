import { useMemo } from 'react';
import { Category, Expense } from '../services/firebaseService';
import { DateFilterMode, getTargetDate } from '../utils/dateUtils';

interface AnalyticsData {
  today: number;
  yesterday: number;
  custom: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  dailyAverage: number;
  targetDate: Date;
  // ✅ ADD new properties
  selectedMonth?: number;
  selectedPreviousMonth?: number;
  selectedMonthDailyAverage?: number;
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
    
    // ✅ TODAY
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

    // ✅ YESTERDAY
    const yesterday = new Date(actualToday);
    yesterday.setDate(actualToday.getDate() - 1);
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const yesterdayExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfYesterday && expenseDate <= endOfYesterday;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ CUSTOM DATE
    const startOfCustom = new Date(selectedDate);
    startOfCustom.setHours(0, 0, 0, 0);
    const endOfCustom = new Date(selectedDate);
    endOfCustom.setHours(23, 59, 59, 999);

    const customExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfCustom && expenseDate <= endOfCustom;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ THIS WEEK
    const getThisWeek = () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

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

    // ✅ THIS MONTH (current month)
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ LAST MONTH (previous month)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ SELECTED MONTH (month from selected date)
    const selectedDateObj = new Date(selectedDate);
    const startOfSelectedMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
    const endOfSelectedMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() + 1, 1);
    
    const selectedMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfSelectedMonth && expenseDate < endOfSelectedMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ SELECTED PREVIOUS MONTH (month before selected date)
    const startOfSelectedPrevMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth() - 1, 1);
    const endOfSelectedPrevMonth = new Date(selectedDateObj.getFullYear(), selectedDateObj.getMonth(), 1);
    
    const selectedPreviousMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfSelectedPrevMonth && expenseDate < endOfSelectedPrevMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // ✅ DAILY AVERAGE for current month
    const thisMonthExpensesList = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
    });

    const expensesByDate = new Map<string, number>();
    thisMonthExpensesList.forEach(expense => {
      const dateKey = new Date(expense.date).toDateString();
      const currentTotal = expensesByDate.get(dateKey) || 0;
      expensesByDate.set(dateKey, currentTotal + expense.amount);
    });

    const daysWithExpenses = expensesByDate.size;
    const dailyAverage = daysWithExpenses > 0 ? Math.round(thisMonthExpenses / daysWithExpenses) : 0;

    // ✅ DAILY AVERAGE for selected month
    const selectedMonthExpensesList = filteredExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfSelectedMonth && expenseDate < endOfSelectedMonth;
    });

    const selectedExpensesByDate = new Map<string, number>();
    selectedMonthExpensesList.forEach(expense => {
      const dateKey = new Date(expense.date).toDateString();
      const currentTotal = selectedExpensesByDate.get(dateKey) || 0;
      selectedExpensesByDate.set(dateKey, currentTotal + expense.amount);
    });

    const selectedDaysWithExpenses = selectedExpensesByDate.size;
    const selectedMonthDailyAverage = selectedDaysWithExpenses > 0 ? Math.round(selectedMonthExpenses / selectedDaysWithExpenses) : 0;

    // Debug logs
    console.log('📊 Analytics calculation (with selected month):', {
      selectedCategory: selectedCategory?.name || 'All',
      dateMode: dateFilterMode,
      selectedDate: selectedDate.toDateString(),
      actualToday: actualToday.toDateString(),
      today: todayExpenses,
      yesterday: yesterdayExpenses,
      custom: customExpenses,
      thisWeek: thisWeekExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      selectedMonth: selectedMonthExpenses,        // ✅ NEW
      selectedPreviousMonth: selectedPreviousMonthExpenses, // ✅ NEW
      selectedMonthDailyAverage: selectedMonthDailyAverage, // ✅ NEW
      dailyAverage,
      daysWithExpenses,
      selectedDaysWithExpenses, // ✅ NEW
      filteredExpensesCount: filteredExpenses.length,
    });

    return {
      today: todayExpenses,
      yesterday: yesterdayExpenses,
      custom: customExpenses,
      thisWeek: thisWeekExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      dailyAverage,
      targetDate,
      // ✅ ADD new calculated values
      selectedMonth: selectedMonthExpenses,
      selectedPreviousMonth: selectedPreviousMonthExpenses,
      selectedMonthDailyAverage: selectedMonthDailyAverage,
    };
  }, [expenses, selectedCategory, dateFilterMode, selectedDate]);
};