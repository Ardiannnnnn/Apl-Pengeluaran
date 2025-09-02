import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
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
import LoadingScreen from "@/components/LoadingScreen";
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

  // ✅ ADD edit states
  const [editMode, setEditMode] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);

  // ✅ NEW: Dynamic time-based icon and greeting
  const getTimeBasedIcon = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 7) {
      // Sunrise (5-7 AM)
      return {
        name: "partly-sunny" as const,
        color: isDark ? "#fbbf24" : "#f59e0b",
      };
    } else if (currentHour >= 7 && currentHour < 18) {
      // Daytime (7 AM - 5 PM)
      return {
        name: "sunny" as const,
        color: isDark ? "#fbbf24" : "#f59e0b",
      };
    } else if (currentHour >= 18 && currentHour < 19) {
      // Sunset (5-7 PM)
      return {
        name: "partly-sunny" as const,
        color: isDark ? "#f97316" : "#ea580c", // Orange for sunset
      };
    } else if (currentHour >= 19 && currentHour < 22) {
      // Early evening (7-10 PM)
      return {
        name: "moon" as const,
        color: isDark ? "#e5e7eb" : "#6b7280",
      };
    } else {
      // Late night/early morning (10 PM - 5 AM)
      return {
        name: "moon" as const,
        color: isDark ? "#9ca3af" : "#4b5563", // Darker for deep night
      };
    }
  };

  // ✅ NEW: Dynamic greeting based on time
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon";
    } else if (currentHour >= 18 && currentHour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  // Get current time-based data
  const timeIcon = getTimeBasedIcon();
  const greeting = getTimeBasedGreeting();

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
  const handleEditExpense = (expense: Expense) => {
    setEditExpense(expense);
    setEditMode(true);
    setShowExpenseForm(true);
  };

  const handleAddExpense = () => {
    setEditExpense(null);
    setEditMode(false);
    setShowExpenseForm(true);
  };

  const handleCloseForm = () => {
    setShowExpenseForm(false);
    setEditMode(false);
    setEditExpense(null);
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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            Alert.alert("Error", "Failed to delete expense");
          }
        },
      },
    ]);
  };

  // Add this helper function at the top of your component
  const formatExpenseDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }

    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Otherwise show formatted date
    return date.toLocaleDateString("id-ID", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return <LoadingScreen message="Loading ..." />;
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
              {/* ✅ UPDATED: Dynamic greeting */}
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {greeting}
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
            {/* ✅ UPDATED: Dynamic time-based icon */}
            <TouchableOpacity
              className={`p-3 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={timeIcon.name}
                size={24}
                color={timeIcon.color}
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
                  // ✅ CHANGE: onPress to edit, onLongPress to delete
                  onPress={() => handleEditExpense(expense)}
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
                        {expense.category} • {formatExpenseDate(expense.date)}
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text
                      className={`text-lg font-bold ${isDark ? "text-red-400" : "text-red-500"}`}
                    >
                      -Rp {expense.amount.toLocaleString()}
                    </Text>
                    {/* ✅ ADD edit icon indicator */}
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={isDark ? "#6b7280" : "#9ca3af"}
                      style={{ marginLeft: 8 }}
                    />
                  </View>
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

      {/* ✅ UPDATE ExpenseForm with edit props */}
      <ExpenseForm
        visible={showExpenseForm}
        onClose={handleCloseForm}
        onSuccess={onRefresh}
        editMode={editMode}
        editExpense={editExpense}
      />
    </SafeAreaView>
  );
}
