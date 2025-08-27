import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

// Components
import CategorySelector from "../../components/CategorySelector";
import DateFilterSelector from "../../components/DateFilterSelector";
import ExpenseForm from "../../components/ExpenseForm";
import ExpenseTrackingCard from "../../components/ExpenseTrackingCard";

// Services & Types
import {
  Category,
  categoryService,
  Expense,
  expenseService,
} from "../../services/firebaseService";

// Hooks & Utils
import { useAnalytics } from "@/hooks/useAnalitycs";
import { useFilteredExpenses } from "@/hooks/useFilteredExpense";
import {
  DateFilterMode,
  formatTargetDate,
  setupMidnightReset,
} from "../../utils/dateUtils";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // State for Firebase data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateFilterMode, setDateFilterMode] = useState<DateFilterMode>("today");

  // Custom hooks for analytics and filtered data
  const analytics = useAnalytics(
    expenses,
    selectedCategory,
    dateFilterMode,
    selectedDate
  );
  const recentExpenses = useFilteredExpenses(
    expenses,
    selectedCategory,
    dateFilterMode,
    selectedDate
  );

  // Load data from Firebase
  useEffect(() => {
    loadData();

    // Setup real-time listener for expenses
    const unsubscribe = expenseService.subscribe((newExpenses) => {
      setExpenses(newExpenses);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener
  }, []);

  // Auto reset at midnight
  useEffect(() => {
    const cleanup = setupMidnightReset(() => {
      setSelectedDate(new Date());
      setDateFilterMode("today");
      loadData();
    });

    return cleanup;
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      Alert.alert("Error", "Failed to load data from Firebase");
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } finally {
      setRefreshing(false);
    }
  };

  // Event handlers
  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    console.log("🏷️ Category selected:", category?.name || "All");
  };

  const handleDateFilterChange = (mode: DateFilterMode, date: Date) => {
    setDateFilterMode(mode);
    setSelectedDate(date);
    console.log("📅 Date filter changed:", mode, date.toDateString());
  };

  const handleResetFilters = () => {
    setSelectedCategory(null);
    setDateFilterMode("today");
    setSelectedDate(new Date());
  };

  const handleDeleteExpense = async (expenseId: string, title: string) => {
    Alert.alert("Delete Expense", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await expenseService.delete(expenseId);
            Alert.alert("Success", "Expense deleted!");
          } catch (error) {
            Alert.alert("Error", "Failed to delete expense");
          }
        },
      },
    ]);
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView
        className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <ActivityIndicator
          size="large"
          color={isDark ? "#3b82f6" : "#2563eb"}
        />
        <Text
          className={`mt-4 text-lg ${isDark ? "text-white" : "text-gray-800"}`}
        >
          Loading data...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        className="flex-1 py-10"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? "#3b82f6" : "#2563eb"}
          />
        }
      >
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
                Ardian
              </Text>
              {selectedCategory && (
                <Text
                  className={`text-xs ${isDark ? "text-blue-400" : "text-blue-500"}`}
                >
                  Filtered by {selectedCategory.name}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className={`p-3 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={isDark ? "#f3f4f6" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* Expense Tracking Card */}
          <ExpenseTrackingCard
            analytics={analytics}
            selectedCategory={selectedCategory}
            dateFilterMode={dateFilterMode}
            selectedDate={selectedDate}
          />
        </View>

        {/* Categories Selector */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Date Filter Selector */}
        <DateFilterSelector
          dateFilterMode={dateFilterMode}
          selectedDate={selectedDate}
          onDateFilterChange={handleDateFilterChange}
        />

        {/* Recent Expenses */}
        <View className="px-6 mt-6 mb-20">
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              {selectedCategory
                ? `${selectedCategory.name} - ${formatTargetDate(dateFilterMode, selectedDate)} (${recentExpenses.length})`
                : `${formatTargetDate(dateFilterMode, selectedDate)} Expenses (${recentExpenses.length})`}
            </Text>
            <TouchableOpacity onPress={handleResetFilters}>
              <Text
                className={`font-medium ${
                  selectedCategory || dateFilterMode !== "today"
                    ? isDark
                      ? "text-blue-400"
                      : "text-blue-500"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              >
                {selectedCategory || dateFilterMode !== "today"
                  ? "See All"
                  : "All"}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={`rounded-2xl shadow-sm ${isDark ? "bg-gray-800 shadow-gray-900" : "bg-white"}`}
          >
            {recentExpenses.length === 0 ? (
              <View className="p-8 items-center">
                <Ionicons
                  name="receipt-outline"
                  size={48}
                  color={isDark ? "#6b7280" : "#9ca3af"}
                />
                <Text
                  className={`mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {selectedCategory
                    ? `No ${selectedCategory.name.toLowerCase()} expenses yet`
                    : "No expenses yet"}
                </Text>
                <Text
                  className={`text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Tap + to add your first expense
                </Text>
              </View>
            ) : (
              recentExpenses.map((expense, index) => (
                <TouchableOpacity
                  key={expense.id}
                  className={`p-4 flex-row items-center justify-between ${
                    index !== recentExpenses.length - 1
                      ? isDark
                        ? "border-b border-gray-700"
                        : "border-b border-gray-100"
                      : ""
                  }`}
                  onLongPress={() =>
                    handleDeleteExpense(expense.id, expense.title)
                  }
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
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className={`absolute bottom-6 right-6 w-14 h-14 rounded-full justify-center items-center shadow-lg ${
          isDark ? "bg-blue-600 shadow-gray-900" : "bg-blue-500"
        }`}
        onPress={handleAddExpense}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ExpenseForm
        visible={showExpenseForm}
        onClose={() => setShowExpenseForm(false)}
        onSuccess={onRefresh}
      />
    </SafeAreaView>
  );
}
