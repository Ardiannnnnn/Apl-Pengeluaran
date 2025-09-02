import { useMemo } from "react";
import { Expense, Category } from "../services/firebaseService";
import {
  DateFilterMode,
  getTargetDate,
  isSameDay,
} from "../utils/dateUtils";

interface FilteredExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: Date;
  icon: string;
}

export const useFilteredExpenses = (
  expenses: Expense[],
  selectedCategory: Category | null,
  dateFilterMode: DateFilterMode,
  selectedDate: Date,
  limit: number = 8
): FilteredExpense[] => {
  return useMemo(() => {
    // Filter by category first
    let filteredExpenses = selectedCategory
      ? expenses.filter((expense) => expense.category === selectedCategory.name)
      : expenses;

    // Then filter by date based on mode
    if (dateFilterMode !== "today" || !isSameDay(selectedDate, new Date())) {
      const targetDate = getTargetDate(dateFilterMode, selectedDate);
      filteredExpenses = filteredExpenses.filter((expense) => {
        return isSameDay(new Date(expense.date), targetDate);
      });
    } else {
      // Today mode - show only today's expenses
      const today = new Date();
      filteredExpenses = filteredExpenses.filter((expense) => {
        return isSameDay(new Date(expense.date), today);
      });
    }

    return filteredExpenses.slice(0, limit).map((expense) => ({
      id: expense.id || "",
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date:
        expense.date instanceof Date ? expense.date : new Date(expense.date), // ✅ Returns Date object
      icon: expense.icon,
    }));
  }, [expenses, selectedCategory, dateFilterMode, selectedDate, limit]);
};
