import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Data dummy untuk expenses tracking
  const expenseData = {
    today: 125000,
    thisMonth: 850000,
    lastMonth: 1200000,
    daysInMonth: 30,
    daysPassed: 15, // hari ke-15 dalam bulan
  };

  // Hitung daily average
  const dailyAverage = Math.round(expenseData.thisMonth / expenseData.daysPassed);

  // Data dummy untuk recent expenses
  const recentExpenses = [
    {
      id: 1,
      title: "Groceries",
      amount: 85000,
      category: "Food",
      date: "Today",
      icon: "restaurant",
    },
    {
      id: 2,
      title: "Gas Station",
      amount: 150000,
      category: "Transport",
      date: "Yesterday",
      icon: "car",
    },
    {
      id: 3,
      title: "Coffee Shop",
      amount: 45000,
      category: "Food",
      date: "2 days ago",
      icon: "cafe",
    },
    {
      id: 4,
      title: "Movie Tickets",
      amount: 120000,
      category: "Entertainment",
      date: "3 days ago",
      icon: "film",
    },
  ];

  const categories = [
    {
      name: "Food",
      icon: "restaurant",
      color: isDark ? "bg-orange-900" : "bg-orange-100",
      iconColor: isDark ? "#fb923c" : "#ea580c",
    },
    {
      name: "Transport",
      icon: "car",
      color: isDark ? "bg-blue-900" : "bg-blue-100",
      iconColor: isDark ? "#60a5fa" : "#2563eb",
    },
    {
      name: "Shopping",
      icon: "bag",
      color: isDark ? "bg-purple-900" : "bg-purple-100",
      iconColor: isDark ? "#a78bfa" : "#7c3aed",
    },
    {
      name: "Bills",
      icon: "receipt",
      color: isDark ? "bg-red-900" : "bg-red-100",
      iconColor: isDark ? "#f87171" : "#dc2626",
    },
  ];

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1 py-10" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View
          className={`m-3 px-6 pt-4 pb-6 rounded-3xl shadow-sm ${
            isDark ? "bg-gray-800 shadow-gray-900" : "bg-white"
          }`}
        >
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Good morning
              </Text>
              <Text
                className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                John Doe
              </Text>
            </View>
            <TouchableOpacity
              className={`p-3 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={isDark ? "#f3f4f6" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* Expense Tracking Card */}
          <View className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={isDark ? ["#1e40af", "#7c3aed"] : ["#3b82f6", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 24 }}
            >
              {/* Today's Expense - Primary */}
              <View className="mb-3">
                <Text className="text-white text-sm opacity-75">Today</Text>
                <Text className="text-white text-3xl font-bold">
                  Rp {expenseData.today.toLocaleString()}
                </Text>
              </View>

              {/* Daily Average - Secondary */}
              <View className="mb-4">
                <Text className="text-white text-xs opacity-75">Daily Average</Text>
                <Text className="text-white text-lg font-semibold">
                  Rp {dailyAverage.toLocaleString()}
                </Text>
              </View>

              {/* Monthly Comparison - Split Bottom */}
              <View className="flex-row justify-between pt-2 border-t border-white border-opacity-20">
                <View className="flex-1">
                  <Text className="text-white text-xs opacity-75">This Month</Text>
                  <Text className="text-white text-lg font-semibold">
                    Rp {(expenseData.thisMonth / 1000000).toFixed(1)}M
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-white text-xs opacity-75">Last Month</Text>
                  <Text className="text-white text-lg font-semibold">
                    Rp {(expenseData.lastMonth / 1000000).toFixed(1)}M
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Categories
            </Text>
            <TouchableOpacity>
              <Text
                className={`font-medium ${isDark ? "text-blue-400" : "text-blue-500"}`}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-2"
          >
            {categories.map((category, index) => (
              <TouchableOpacity key={index} className="mx-2">
                <View
                  className={`${category.color} p-4 rounded-2xl w-20 h-20 justify-center items-center`}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.iconColor}
                  />
                </View>
                <Text
                  className={`text-center text-sm mt-2 font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Expenses */}
        <View className="px-6 mt-6 mb-20">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Recent Expenses
            </Text>
            <TouchableOpacity>
              <Text
                className={`font-medium ${isDark ? "text-blue-400" : "text-blue-500"}`}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`rounded-2xl shadow-sm ${
              isDark ? "bg-gray-800 shadow-gray-900" : "bg-white"
            }`}
          >
            {recentExpenses.map((expense, index) => (
              <TouchableOpacity
                key={expense.id}
                className={`p-4 flex-row items-center justify-between ${
                  index !== recentExpenses.length - 1
                    ? isDark
                      ? "border-b border-gray-700"
                      : "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`p-3 rounded-full mr-3 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <Ionicons
                      name={expense.icon as any}
                      size={20}
                      color={isDark ? "#d1d5db" : "#6b7280"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                    >
                      {expense.title}
                    </Text>
                    <Text
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {expense.category} • {expense.date}
                    </Text>
                  </View>
                </View>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-red-400" : "text-red-500"}`}
                >
                  -Rp {expense.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg ${
          isDark ? "bg-blue-600 shadow-gray-900" : "bg-blue-500"
        }`}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
