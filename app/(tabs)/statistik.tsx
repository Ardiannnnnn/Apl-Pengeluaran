import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Expense, expenseService } from "../../services/firebaseService";

export default function StatistikScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // State
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [period, setPeriod] = useState<"week" | "month">("week");

  // Load expenses
  useEffect(() => {
    const unsubscribe = expenseService.subscribe((expenseData) => {
      setExpenses(expenseData);
    });
    return unsubscribe;
  }, []);

  // ✅ HELPER FUNCTIONS

  // Calculate actual week period (Monday to Sunday)
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

  // Calculate actual month period (1st to last day of month)
  const getThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDay.setHours(0, 0, 0, 0);

    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    return { start: firstDay, end: lastDay };
  };

  // Get expenses for current period
  const getCurrentPeriodExpenses = () => {
    if (period === "week") {    
      const { start, end } = getThisWeek();
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    } else {
      const { start, end } = getThisMonth();
      return expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });
    }
  };

  // Calculate stats for current period
  const getActualStats = () => {
    const periodExpenses = getCurrentPeriodExpenses();
    const total = periodExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    // Calculate days with expenses for proper daily average
    const expensesByDate = new Map<string, number>();
    periodExpenses.forEach((expense) => {
      const dateKey = new Date(expense.date).toDateString();
      const currentTotal = expensesByDate.get(dateKey) || 0;
      expensesByDate.set(dateKey, currentTotal + expense.amount);
    });

    const daysWithExpenses = expensesByDate.size;
    const average =
      daysWithExpenses > 0 ? Math.round(total / daysWithExpenses) : 0;

    return {
      total,
      average,
      count: periodExpenses.length,
      daysWithExpenses,
    };
  };

  // Get chart data function - Using actual calendar periods
  const getChartData = () => {
    const chartData = [];
    const currentDate = new Date();

    if (period === "week") {
      // Show this week (Monday to Sunday)
      const { start } = getThisWeek();

      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        // Only show dates up to today
        if (date <= currentDate) {
          const dayExpenses = expenses.filter((expense) => {
            const expenseDate = new Date(expense.date);
            return expenseDate.toDateString() === date.toDateString();
          });

          const total = dayExpenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
          );

          chartData.push({
            day: date.toLocaleDateString("id-ID", { weekday: "short" }),
            fullDay: date.toLocaleDateString("id-ID", { weekday: "long" }),
            amount: total,
            date: date.getDate(),
            month: date.toLocaleDateString("id-ID", { month: "short" }),
            transactionCount: dayExpenses.length,
            isToday: date.toDateString() === currentDate.toDateString(),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
            dateKey: date.toDateString(),
          });
        }
      }

      // Reverse to show most recent first
      return chartData.reverse();
    } else {
      // Show this month (1st to today)
      const { start } = getThisMonth();
      const daysInMonth = [];

      for (
        let i = 0;
        start.getDate() + i <= currentDate.getDate() ||
        start.getMonth() !== currentDate.getMonth();
        i++
      ) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        // Stop if we've moved to next month or beyond today
        if (date.getMonth() !== start.getMonth() || date > currentDate) {
          break;
        }

        daysInMonth.push(date);
      }

      // Process days in reverse order (most recent first)
      for (let i = daysInMonth.length - 1; i >= 0; i--) {
        const date = daysInMonth[i];

        const dayExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === date.toDateString();
        });

        const total = dayExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        chartData.push({
          day: date.toLocaleDateString("id-ID", { weekday: "short" }),
          fullDay: date.toLocaleDateString("id-ID", { weekday: "long" }),
          amount: total,
          date: date.getDate(),
          month: date.toLocaleDateString("id-ID", { month: "short" }),
          transactionCount: dayExpenses.length,
          isToday: date.toDateString() === currentDate.toDateString(),
          isWeekend: date.getDay() === 0 || date.getDay() === 6,
          dateKey: date.toDateString(),
        });
      }

      return chartData;
    }
  };

  // ✅ CALCULATE DATA
  const chartData = getChartData();
  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);
  const stats = getActualStats();

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="py-14 pb-6">
          <Text
            className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Statistics
          </Text>
          <Text
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            Your spending overview
          </Text>
        </View>
        {/* Period Toggle */}
        <View
          className={`${isDark ? "bg-gray-800" : "bg-white"} p-1 rounded-xl mb-6 flex-row`}
        >
          <TouchableOpacity
            onPress={() => setPeriod("week")}
            className={`flex-1 py-3 rounded-lg ${
              period === "week" ? "bg-blue-500" : ""
            }`}
          >
            <Text
              className={`text-center font-medium ${
                period === "week"
                  ? "text-white"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-600"
              }`}
            >
              This Week
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPeriod("month")}
            className={`flex-1 py-3 rounded-lg ${
              period === "month" ? "bg-blue-500" : ""
            }`}
          >
            <Text
              className={`text-center font-medium ${
                period === "month"
                  ? "text-white"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-600"
              }`}
            >
              This Month
            </Text>
          </TouchableOpacity>
        </View>
        {/* Main Stats */}
        <View
          className={`${isDark ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl mb-6`}
        >
          {/* Total Spending */}
          <View className="items-center mb-6">
            <Text
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Total Spending
            </Text>
            <Text
              className={`text-3xl font-bold ${isDark ? "text-white" : "text-gray-800"} mt-1`}
            >
              Rp {stats.total.toLocaleString("id-ID")}
            </Text>
            <Text
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"} mt-1`}
            >
              {period === "week"
                ? `this week (${getThisWeek().start.toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - ${getThisWeek().end.toLocaleDateString("id-ID", { day: "numeric", month: "short" })})`
                : `this month (${getThisMonth().start.toLocaleDateString("id-ID", { month: "long", year: "numeric" })})`}
            </Text>
          </View>

          {/* Quick Stats */}
          <View className="flex-row space-x-4">
            <View className="flex-1 items-center">
              <View
                className={`${isDark ? "bg-blue-900" : "bg-blue-100"} p-3 rounded-full mb-2`}
              >
                <Ionicons
                  name="calendar"
                  size={20}
                  color={isDark ? "#60a5fa" : "#2563eb"}
                />
              </View>
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Daily Avg
              </Text>
              <Text
                className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Rp {stats.average.toLocaleString("id-ID")}
              </Text>
            </View>

            <View className="flex-1 items-center">
              <View
                className={`${isDark ? "bg-green-900" : "bg-green-100"} p-3 rounded-full mb-2`}
              >
                <Ionicons
                  name="receipt"
                  size={20}
                  color={isDark ? "#4ade80" : "#16a34a"}
                />
              </View>
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Transactions
              </Text>
              <Text
                className={`font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                {stats.count}
              </Text>
            </View>
          </View>
        </View>
        {/* Chart Section */}
        <View
          className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-2xl mb-6 overflow-hidden shadow-sm`}
        >
          {/* Chart Header */}
          <View className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row justify-between items-center">
              <View>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  Daily Activity
                </Text>
                <Text
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
                >
                  {period === "week"
                    ? "This week breakdown"
                    : "This month breakdown"}
                </Text>
              </View>
              <View
                className={`${isDark ? "bg-blue-900" : "bg-blue-100"} px-3 py-1 rounded-full`}
              >
                <Text
                  className={`text-xs font-medium ${isDark ? "text-blue-200" : "text-blue-700"}`}
                >
                  {period === "week"
                    ? `Week ${Math.ceil(new Date().getDate() / 7)}`
                    : new Date().toLocaleDateString("id-ID", {
                        month: "short",
                        year: "numeric",
                      })}
                </Text>
              </View>
            </View>
          </View>

          {/* Chart Content */}
          <View className="px-6 py-4">
            {chartData.length === 0 ? (
              <View className="py-12 items-center">
                <View
                  className={`${isDark ? "bg-gray-700" : "bg-gray-100"} p-4 rounded-full mb-3`}
                >
                  <Ionicons
                    name="bar-chart-outline"
                    size={32}
                    color={isDark ? "#6b7280" : "#9ca3af"}
                  />
                </View>
                <Text
                  className={`text-center font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  No spending data
                </Text>
                <Text
                  className={`text-center text-sm ${isDark ? "text-gray-500" : "text-gray-400"} mt-1`}
                >
                  Start adding expenses to see your daily pattern
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: period === "month" ? 400 : undefined }}
                nestedScrollEnabled={true}
              >
                <View className="space-y-4">
                  {chartData.map((data, index) => {
                    const barWidth =
                      maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                    const hasExpense = data.amount > 0;
                    const isToday = data.isToday;

                    return (
                      <View
                        key={data.dateKey}
                        className={`${
                          isToday
                            ? isDark
                              ? "bg-blue-900/30 border border-blue-500/20"
                              : "bg-blue-50 border border-blue-200/50"
                            : ""
                        } p-3 rounded-xl`}
                      >
                        {/* Day Info Header */}
                        <View className="flex-row justify-between items-start mb-3">
                          <View className="flex-1">
                            <View className="flex-row items-center">
                              <Text
                                className={`text-sm font-semibold ${
                                  isToday
                                    ? isDark
                                      ? "text-blue-300"
                                      : "text-blue-600"
                                    : isDark
                                      ? "text-white"
                                      : "text-gray-800"
                                }`}
                              >
                                {data.day} {data.date}
                              </Text>
                              {isToday && (
                                <View className="ml-2 bg-blue-500 px-2 py-0.5 rounded-full">
                                  <Text className="text-white text-xs font-medium">
                                    Today
                                  </Text>
                                </View>
                              )}
                              {data.isWeekend && !isToday && (
                                <View
                                  className={`ml-2 ${isDark ? "bg-purple-900" : "bg-purple-100"} px-2 py-0.5 rounded-full`}
                                >
                                  <Text
                                    className={`${isDark ? "text-purple-200" : "text-purple-700"} text-xs font-medium`}
                                  >
                                    Weekend
                                  </Text>
                                </View>
                              )}
                            </View>
                            <Text
                              className={`text-xs ${
                                isToday
                                  ? isDark
                                    ? "text-blue-400"
                                    : "text-blue-500"
                                  : isDark
                                    ? "text-gray-400"
                                    : "text-gray-500"
                              } mt-0.5`}
                            >
                              {data.month}
                            </Text>
                          </View>

                          {/* Amount & Transaction Count */}
                          <View className="items-end">
                            <Text
                              className={`font-bold ${
                                hasExpense
                                  ? isToday
                                    ? isDark
                                      ? "text-blue-300"
                                      : "text-blue-600"
                                    : isDark
                                      ? "text-white"
                                      : "text-gray-800"
                                  : isDark
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            >
                              {hasExpense
                                ? `Rp ${data.amount.toLocaleString("id-ID")}`
                                : "No spending"}
                            </Text>

                            {/* Transaction Count Display */}
                            {data.transactionCount > 0 && (
                              <View className="flex-row items-center mt-1">
                                <Ionicons
                                  name="receipt-outline"
                                  size={12}
                                  color={
                                    isToday
                                      ? isDark
                                        ? "#93c5fd"
                                        : "#3b82f6"
                                      : isDark
                                        ? "#9ca3af"
                                        : "#6b7280"
                                  }
                                />
                                <Text
                                  className={`text-xs ml-1 ${
                                    isToday
                                      ? isDark
                                        ? "text-blue-400"
                                        : "text-blue-500"
                                      : isDark
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                  }`}
                                >
                                  {data.transactionCount} transaction
                                  {data.transactionCount > 1 ? "s" : ""}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {/* Progress Bar */}
                        <View
                          className={`${isDark ? "bg-gray-700" : "bg-gray-100"} h-3 rounded-full overflow-hidden`}
                        >
                          {hasExpense && (
                            <LinearGradient
                              colors={
                                isToday
                                  ? ["#3b82f6", "#60a5fa"]
                                  : ["#10b981", "#34d399"]
                              }
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={{
                                width: `${Math.max(barWidth, 5)}%`,
                                height: "100%",
                                borderRadius: 6,
                              }}
                            />
                          )}
                        </View>

                        {/* Quick Stats for days with expenses */}
                        {data.transactionCount > 0 && (
                          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                            <Text
                              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                            >
                              Avg per transaction
                            </Text>
                            <Text
                              className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}
                            >
                              Rp{" "}
                              {Math.round(
                                data.amount / data.transactionCount
                              ).toLocaleString("id-ID")}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>

          {/* Chart Legend */}
          <View
            className={`px-6 py-4 border-t ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}
          >
            <View className="flex-row justify-center space-x-6">
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                <Text
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Today
                </Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                <Text
                  className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Other days
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="receipt-outline"
                  size={12}
                  color={isDark ? "#9ca3af" : "#6b7280"}
                />
                <Text
                  className={`text-xs ml-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Transactions
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
