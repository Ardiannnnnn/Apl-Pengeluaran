import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatistikScreen() {
  // Data dummy untuk statistik
  const monthlyData = [
    { month: "Jan", income: 3500000, expense: 2800000 },
    { month: "Feb", income: 4200000, expense: 3100000 },
    { month: "Mar", income: 3800000, expense: 2900000 },
    { month: "Apr", income: 4500000, expense: 3400000 },
    { month: "May", income: 3900000, expense: 3200000 },
    { month: "Jun", income: 4100000, expense: 2750000 },
  ];

  const categoryExpenses = [
    {
      name: "Food & Dining",
      amount: 850000,
      percentage: 35,
      color: "bg-orange-500",
      icon: "restaurant",
    },
    {
      name: "Transportation",
      amount: 600000,
      percentage: 25,
      color: "bg-blue-500",
      icon: "car",
    },
    {
      name: "Shopping",
      amount: 480000,
      percentage: 20,
      color: "bg-purple-500",
      icon: "bag",
    },
    {
      name: "Bills & Utilities",
      amount: 320000,
      percentage: 13,
      color: "bg-red-500",
      icon: "receipt",
    },
    {
      name: "Entertainment",
      amount: 170000,
      percentage: 7,
      color: "bg-green-500",
      icon: "game-controller",
    },
  ];

  const timeFilters = ["7D", "1M", "3M", "6M", "1Y"];
  const activeFilter = "1M";

  const totalIncome = monthlyData.reduce((sum, data) => sum + data.income, 0);
  const totalExpense = monthlyData.reduce((sum, data) => sum + data.expense, 0);
  const totalSavings = totalIncome - totalExpense;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">Statistics</Text>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="calendar-outline" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Time Filter */}
          <View className="flex-row bg-gray-100 p-1 rounded-xl">
            {timeFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                className={`flex-1 py-2 px-3 rounded-lg ${
                  activeFilter === filter ? "bg-white shadow-sm" : ""
                }`}
              >
                <Text
                  className={`text-center font-medium ${
                    activeFilter === filter ? "text-blue-500" : "text-gray-600"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Cards */}
        <View className="px-6 mt-6">
          <View className="flex-row space-x-3">
            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm">
              <View className="flex-row items-center mb-2">
                <View className="bg-green-100 p-2 rounded-full mr-2">
                  <Ionicons name="trending-up" size={16} color="#059669" />
                </View>
                <Text className="text-gray-600 text-sm">Income</Text>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Rp {(totalIncome / 1000000).toFixed(1)}M
              </Text>
              <Text className="text-green-500 text-xs">
                +12% from last month
              </Text>
            </View>

            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm">
              <View className="flex-row items-center mb-2">
                <View className="bg-red-100 p-2 rounded-full mr-2">
                  <Ionicons name="trending-down" size={16} color="#dc2626" />
                </View>
                <Text className="text-gray-600 text-sm">Expense</Text>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Rp {(totalExpense / 1000000).toFixed(1)}M
              </Text>
              <Text className="text-red-500 text-xs">+5% from last month</Text>
            </View>

            <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm">
              <View className="flex-row items-center mb-2">
                <View className="bg-blue-100 p-2 rounded-full mr-2">
                  <Ionicons name="wallet" size={16} color="#2563eb" />
                </View>
                <Text className="text-gray-600 text-sm">Savings</Text>
              </View>
              <Text className="text-lg font-bold text-gray-800">
                Rp {(totalSavings / 1000000).toFixed(1)}M
              </Text>
              <Text className="text-blue-500 text-xs">
                +18% from last month
              </Text>
            </View>
          </View>
        </View>

        {/* Monthly Chart */}
        <View className="px-6 mt-6">
          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Monthly Overview
            </Text>

            {/* Simple Bar Chart */}
            <View className="space-y-4">
              {monthlyData.map((data, index) => {
                const maxAmount = Math.max(
                  ...monthlyData.map((d) => Math.max(d.income, d.expense))
                );
                const incomeWidth = (data.income / maxAmount) * 100;
                const expenseWidth = (data.expense / maxAmount) * 100;

                return (
                  <View key={index} className="space-y-2">
                    <Text className="text-sm font-medium text-gray-600">
                      {data.month}
                    </Text>

                    {/* Income Bar */}
                    <View className="flex-row items-center">
                      <Text className="w-12 text-xs text-gray-500">Inc</Text>
                      <View className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                        <View
                          className="bg-green-500 h-full rounded-full"
                          style={{ width: `${incomeWidth}%` }}
                        />
                      </View>
                      <Text className="w-16 text-xs text-gray-600 text-right">
                        {(data.income / 1000000).toFixed(1)}M
                      </Text>
                    </View>

                    {/* Expense Bar */}
                    <View className="flex-row items-center">
                      <Text className="w-12 text-xs text-gray-500">Exp</Text>
                      <View className="flex-1 bg-gray-100 h-3 rounded-full overflow-hidden">
                        <View
                          className="bg-red-500 h-full rounded-full"
                          style={{ width: `${expenseWidth}%` }}
                        />
                      </View>
                      <Text className="w-16 text-xs text-gray-600 text-right">
                        {(data.expense / 1000000).toFixed(1)}M
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View className="px-6 mt-6">
          <View className="bg-white p-6 rounded-2xl shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-800">
                Expense Categories
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">Details</Text>
              </TouchableOpacity>
            </View>

            {/* Simplified Chart - Progress Bars */}
            <View className="mb-6">
              <Text className="text-center text-sm text-gray-600 mb-4">
                Category Distribution
              </Text>
              <View className="space-y-3">
                {categoryExpenses.map((category, index) => (
                  <View key={index} className="flex-row items-center">
                    <View
                      className={`${category.color} w-3 h-3 rounded-full mr-3`}
                    />
                    <View className="flex-1">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-sm font-medium text-gray-700">
                          {category.name}
                        </Text>
                        <Text className="text-sm text-gray-600">
                          {category.percentage}%
                        </Text>
                      </View>
                      <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                        <View
                          className={category.color.replace("bg-", "bg-")}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Category List */}
            <View className="space-y-3">
              {categoryExpenses.map((category, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View className={`${category.color} p-2 rounded-full mr-3`}>
                      <Ionicons
                        name={category.icon as any}
                        size={16}
                        color="white"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium text-gray-800">
                        {category.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {category.percentage}% of total
                      </Text>
                    </View>
                  </View>
                  <Text className="font-bold text-gray-800">
                    Rp {category.amount.toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Insights */}
        <View className="px-6 mt-6 mb-8">
          <View className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bulb" size={20} color="white" />
              <Text className="text-white font-bold text-lg ml-2">
                Smart Insights
              </Text>
            </View>
            <Text className="text-white opacity-90 text-sm leading-6">
              Your food expenses increased by 15% this month. Consider setting a
              budget limit of Rp 750,000 for dining to maintain your savings
              goal.
            </Text>
            <TouchableOpacity className="bg-white bg-opacity-20 p-3 rounded-xl mt-4">
              <Text className="text-white font-medium text-center">
                Set Budget Alert
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
