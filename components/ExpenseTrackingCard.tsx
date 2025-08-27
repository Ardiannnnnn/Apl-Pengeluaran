import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Category } from "../services/firebaseService";
import { DateFilterMode, formatTargetDate } from "../utils/dateUtils";

interface AnalyticsData {
  today: number;
  thisMonth: number;
  lastMonth: number;
  dailyAverage: number;
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

  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}K`;
    } else {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
  };

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
              ? `${selectedCategory.name} - ${formatTargetDate(dateFilterMode, selectedDate)}`
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
            {dateFilterMode !== "today" && (
              <>
                <Ionicons name="calendar" size={12} color="white" />
                <Text className="text-white text-xs opacity-75 ml-1">Date</Text>
              </>
            )}
          </View>
        </View>

        <Text className="text-white text-3xl font-bold">
          Rp {analytics.today.toLocaleString("id-ID")}
        </Text>

        {/* Daily Average */}
        <View className="mb-4 mt-3">
          <Text className="text-white text-xs opacity-75">
            Daily Average {selectedCategory ? `(${selectedCategory.name})` : ""}
          </Text>
          <Text className="text-white text-lg font-semibold">
            Rp {analytics.dailyAverage.toLocaleString("id-ID")}
          </Text>
        </View>

        {/* Monthly Comparison */}
        <View className="flex-row justify-between pt-2 border-t border-white border-opacity-20">
          <View className="flex-1">
            <Text className="text-white text-xs opacity-75">This Month</Text>
            <Text className="text-white text-lg font-semibold">
              {formatAmount(analytics.thisMonth)}
            </Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-white text-xs opacity-75">Last Month</Text>
            <Text className="text-white text-lg font-semibold">
              {formatAmount(analytics.lastMonth)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}
