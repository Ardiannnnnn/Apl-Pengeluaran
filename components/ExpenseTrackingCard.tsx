import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { Category } from "../services/firebaseService";
import { DateFilterMode, formatTargetDate } from "../utils/dateUtils";

interface AnalyticsData {
  today: number;
  yesterday: number;
  custom: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  dailyAverage: number;
  selectedMonth?: number;
  selectedPreviousMonth?: number;
  selectedMonthDailyAverage?: number;
}

interface ExpenseTrackingCardProps {
  analytics: AnalyticsData;
  selectedCategory: Category | null;
  dateFilterMode: DateFilterMode;
  selectedDate: Date;
}

export default function ExpenseTrackingCard({
  analytics,
  selectedCategory,
  dateFilterMode,
  selectedDate,
}: ExpenseTrackingCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // ✅ Keep formatAmount for very large numbers only (optional)
  // const formatAmount = (amount: number): string => {
  //   if (amount >= 10000000) {
  //     // Only for 10M+
  //     return `Rp ${(amount / 1000000).toFixed(1)}M`;
  //   } else {
  //     return `Rp ${amount.toLocaleString("id-ID")}`;
  //   }
  // };

  // ✅ NEW: Format exact amount without any rounding
  const formatExactAmount = (amount: number): string => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Get amount based on selected date filter mode
  const getMainAmount = (): number => {
    switch (dateFilterMode) {
      case "today":
        return analytics.today;
      case "yesterday":
        return analytics.yesterday;
      case "custom":
        return analytics.custom;
      default:
        return analytics.today;
    }
  };

  // Get context-aware month data
  const getMonthContext = () => {
    const now = new Date();
    const selected = new Date(selectedDate);

    if (dateFilterMode === "custom") {
      const selectedMonth = selected.getMonth();
      const selectedYear = selected.getFullYear();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      if (selectedMonth === currentMonth && selectedYear === currentYear) {
        return {
          thisMonthLabel: "This Month",
          lastMonthLabel: "Last Month",
          thisMonthData: analytics.thisMonth,
          lastMonthData: analytics.lastMonth,
          dailyAvg: analytics.dailyAverage,
        };
      } else {
        const prevMonth = new Date(selectedYear, selectedMonth - 1);
        return {
          thisMonthLabel: selected.toLocaleDateString("id-ID", {
            month: "short",
            year: "numeric",
          }),
          lastMonthLabel: prevMonth.toLocaleDateString("id-ID", {
            month: "short",
            year: "numeric",
          }),
          thisMonthData: analytics.selectedMonth || 0,
          lastMonthData: analytics.selectedPreviousMonth || 0,
          dailyAvg: analytics.selectedMonthDailyAverage || 0,
        };
      }
    } else {
      return {
        thisMonthLabel: "This Month",
        lastMonthLabel: "Last Month",
        thisMonthData: analytics.thisMonth,
        lastMonthData: analytics.lastMonth,
        dailyAvg: analytics.dailyAverage,
      };
    }
  };

  const monthContext = getMonthContext();

  return (
    <View className="rounded-2xl overflow-hidden">
      <LinearGradient
        colors={isDark ? ["#1e40af", "#7c3aed"] : ["#3b82f6", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ padding: 24 }}
      >
        {/* Header with filter indicator */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-sm opacity-75">
            {selectedCategory
              ? `${selectedCategory.name} - ${formatTargetDate(
                  dateFilterMode,
                  selectedDate
                )}`
              : formatTargetDate(dateFilterMode, selectedDate)}
          </Text>
          <View className="flex-row items-center">
            {selectedCategory && (
              <>
                <Ionicons name="filter" size={12} color="white" />
                <Text className="text-white text-xs opacity-75 ml-1">
                  Category
                </Text>
              </>
            )}
            <>
              <Ionicons name="calendar" size={12} color="white" />
              <Text className="text-white text-xs opacity-75 ml-1">Date</Text>
            </>
          </View>
        </View>

        {/* ✅ Main Amount - Exact value */}
        <Text className="text-white text-3xl font-bold">
          {formatExactAmount(getMainAmount())}
        </Text>

        {/* Dynamic subtitle based on date mode */}
        <View className="mb-4 mt-2">
          <Text className="text-white text-xs opacity-75">
            Total spending on{" "}
            {formatTargetDate(dateFilterMode, selectedDate).toLowerCase()}
            {selectedCategory ? ` (${selectedCategory.name})` : ""}
          </Text>
        </View>

        {/* ✅ Daily Average - Exact value */}
        <View className="mb-4">
          <Text className="text-white text-xs opacity-75">
            Daily Average {selectedCategory ? `(${selectedCategory.name})` : ""}
          </Text>
          <Text className="text-white text-lg font-semibold">
            {formatExactAmount(monthContext.dailyAvg)}
          </Text>
        </View>

        {/* ✅ Month Comparison - Exact values */}
        <View className="flex-row justify-between pt-2 border-t border-white border-opacity-20">
          <View className="flex-1">
            <Text className="text-white text-xs opacity-75">
              {monthContext.thisMonthLabel}
            </Text>
            <Text className="text-white text-sm font-semibold">
              {/* ✅ CHANGED: Use formatExactAmount instead of formatAmount */}
              {formatExactAmount(monthContext.thisMonthData)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-white text-xs opacity-75">
              {monthContext.lastMonthLabel}
            </Text>
            <Text className="text-white text-sm font-semibold">
              {/* ✅ CHANGED: Use formatExactAmount instead of formatAmount */}
              {formatExactAmount(monthContext.lastMonthData)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
