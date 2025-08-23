import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  // Data dummy untuk expenses
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
      color: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      name: "Transport",
      icon: "car",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      name: "Shopping",
      icon: "bag",
      color: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      name: "Bills",
      icon: "receipt",
      color: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="h-10 bg-white" />
      <StatusBar style="dark" translucent />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white m-3 px-6 pt-4 pb-6 rounded-3xl shadow-sm">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-gray-600 text-sm">Good morning</Text>
              <Text className="text-2xl font-bold text-gray-800">John Doe</Text>
            </View>
            <TouchableOpacity className="bg-gray-100 p-3 rounded-full">
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#374151"
              />
            </TouchableOpacity>
          </View>

          {/* Balance Card with Real Gradient */}
          <View className="rounded-2xl overflow-hidden">
            <LinearGradient
              colors={["#3b82f6", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 24 }} // padding manual
            >
              <Text className="text-white text-sm opacity-90">
                Total Balance
              </Text>
              <Text className="text-white text-3xl font-bold mt-1">
                Rp 2,450,000
              </Text>

              <View className="flex-row justify-between mt-4">
                <View>
                  <Text className="text-white text-xs opacity-75">
                    This Month
                  </Text>
                  <Text className="text-white text-lg font-semibold">
                    Rp 850,000
                  </Text>
                </View>
                <View>
                  <Text className="text-white text-xs opacity-75">
                    Last Month
                  </Text>
                  <Text className="text-white text-lg font-semibold">
                    Rp 1,200,000
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm flex-1 mr-2 items-center">
              <View className="bg-green-100 p-3 rounded-full mb-2">
                <Ionicons name="add" size={24} color="#059669" />
              </View>
              <Text className="text-gray-700 font-medium">Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm flex-1 mx-1 items-center">
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <Ionicons name="stats-chart" size={24} color="#2563eb" />
              </View>
              <Text className="text-gray-700 font-medium">Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm flex-1 ml-2 items-center">
              <View className="bg-purple-100 p-3 rounded-full mb-2">
                <Ionicons name="card" size={24} color="#7c3aed" />
              </View>
              <Text className="text-gray-700 font-medium">Budget</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <View className="px-6 mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Categories</Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">See All</Text>
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
                    className={category.iconColor}
                  />
                </View>
                <Text className="text-center text-sm text-gray-600 mt-2 font-medium">
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Expenses */}
        <View className="px-6 mt-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Recent Expenses
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm">
            {recentExpenses.map((expense, index) => (
              <TouchableOpacity
                key={expense.id}
                className={`p-4 flex-row items-center justify-between ${index !== recentExpenses.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-gray-100 p-3 rounded-full mr-3">
                    <Ionicons
                      name={expense.icon as any}
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {expense.title}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {expense.category} • {expense.date}
                    </Text>
                  </View>
                </View>
                <Text className="text-lg font-bold text-red-500">
                  -Rp {expense.amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full justify-center items-center shadow-lg">
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
