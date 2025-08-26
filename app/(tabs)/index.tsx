import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import CategorySelector from '../../components/CategorySelector';
import ExpenseForm from '../../components/ExpenseForm';
import { Category, categoryService, Expense, expenseService } from "../../services/firebaseService";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // State for Firebase data
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  
  // ✅ NEW: Category filter state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Add new state for date filter
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateFilterMode, setDateFilterMode] = useState<'today' | 'yesterday' | 'custom'>('today');

  // ✅ MOVE: Helper functions to top (before they're used)
  
  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  // Enhanced date formatting
  const formatDate = (date: Date): string => {
    const now = new Date();
    const expenseDate = new Date(date);
    
    if (isSameDay(expenseDate, now)) return "Today";
    
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (isSameDay(expenseDate, yesterday)) return "Yesterday";
    
    const diffTime = now.getTime() - expenseDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return expenseDate.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Format target date for display
  const formatTargetDate = (): string => {
    const today = new Date();
    
    switch (dateFilterMode) {
      case 'today':
        return 'Today';
      case 'yesterday':
        return 'Yesterday';
      case 'custom':
        if (isSameDay(selectedDate, today)) return 'Today';
        
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (isSameDay(selectedDate, yesterday)) return 'Yesterday';
        
        return selectedDate.toLocaleDateString('id-ID', { 
          weekday: 'short',
          day: 'numeric', 
          month: 'short' 
        });
      default:
        return 'Today';
    }
  };

  // ✅ MOVE: DateFilterSelector component (after helper functions)
  const DateFilterSelector = () => (
    <View className="px-6 mt-6">
      <Text className={`text-lg font-bold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}>
        Date Filter
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
        {/* Today Button */}
        <TouchableOpacity
          onPress={() => {
            setDateFilterMode('today');
            setSelectedDate(new Date());
          }}
          className={`mx-1 px-4 py-2 rounded-full ${
            dateFilterMode === 'today'
              ? isDark ? 'bg-blue-600' : 'bg-blue-500'
              : isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Text className={`font-medium ${
            dateFilterMode === 'today' 
              ? 'text-white' 
              : isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Today
          </Text>
        </TouchableOpacity>

        {/* Yesterday Button */}
        <TouchableOpacity
          onPress={() => {
            setDateFilterMode('yesterday');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            setSelectedDate(yesterday);
          }}
          className={`mx-1 px-4 py-2 rounded-full ${
            dateFilterMode === 'yesterday'
              ? isDark ? 'bg-blue-600' : 'bg-blue-500'
              : isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <Text className={`font-medium ${
            dateFilterMode === 'yesterday' 
              ? 'text-white' 
              : isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Yesterday
          </Text>
        </TouchableOpacity>

        {/* Last 7 Days Quick Buttons */}
        {Array.from({ length: 5 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (i + 2)); // Start from 2 days ago
          
          const isSelected = dateFilterMode === 'custom' && isSameDay(selectedDate, date);
          
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setDateFilterMode('custom');
                setSelectedDate(date);
              }}
              className={`mx-1 px-3 py-2 rounded-full ${
                isSelected
                  ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                  : isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <Text className={`text-sm font-medium ${
                isSelected 
                  ? 'text-white' 
                  : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Calendar Picker Button */}
        <TouchableOpacity
          onPress={() => {
            // You can implement a date picker modal here
            Alert.alert(
              'Custom Date',
              'Date picker will be implemented here',
              [{ text: 'OK' }]
            );
          }}
          className={`mx-1 px-4 py-2 rounded-full ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}
        >
          <View className="flex-row items-center">
            <Ionicons 
              name="calendar" 
              size={16} 
              color={isDark ? '#d1d5db' : '#374151'} 
            />
            <Text className={`ml-1 font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Custom
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
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

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load categories
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
      
      // Expenses loaded via real-time listener
    } catch (error) {
      console.error('❌ Error loading data:', error);
      Alert.alert('Error', 'Failed to load data from Firebase');
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

  // Add sample expense (for testing)
  const handleAddExpense = () => {
    setShowExpenseForm(true);
  };

  // Auto reset at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Next midnight
      
      const timeToMidnight = midnight.getTime() - now.getTime();
      
      console.log(`⏰ Time to midnight: ${Math.round(timeToMidnight / 1000 / 60)} minutes`);
      
      setTimeout(() => {
        console.log('🌅 Midnight reached! Resetting today data...');
        setSelectedDate(new Date()); // Reset to new day
        setDateFilterMode('today'); // Reset to today mode
        loadData(); // Refresh data
        checkMidnight(); // Schedule next midnight check
      }, timeToMidnight);
    };

    checkMidnight();
  }, []);

  // Enhanced date-aware analytics calculation
  const calculateAnalytics = () => {
    const now = new Date();
    
    // Filter by selected category first
    let filteredExpenses = selectedCategory 
      ? expenses.filter(expense => expense.category === selectedCategory.name)
      : expenses;

    // Get target date based on filter mode
    const getTargetDate = () => {
      const today = new Date();
      switch (dateFilterMode) {
        case 'today':
          return today;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return yesterday;
        case 'custom':
          return selectedDate;
        default:
          return today;
      }
    };

    const targetDate = getTargetDate();
    
    // Today's calculation (based on selected date)
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const todayExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfDay && expenseDate <= endOfDay;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // This month's calculation
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    const thisMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfThisMonth && expenseDate < endOfThisMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // Last month's calculation
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const lastMonthExpenses = filteredExpenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= startOfLastMonth && expenseDate < endOfLastMonth;
      })
      .reduce((total, expense) => total + expense.amount, 0);

    // Daily average (based on this month)
    const daysPassed = now.getDate();
    const dailyAverage = daysPassed > 0 ? Math.round(thisMonthExpenses / daysPassed) : 0;

    console.log('📊 Analytics calculation:', {
      selectedCategory: selectedCategory?.name || 'All',
      dateMode: dateFilterMode,
      targetDate: targetDate.toDateString(),
      today: todayExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      dailyAverage,
      filteredExpensesCount: filteredExpenses.length,
    });

    return {
      today: todayExpenses,
      thisMonth: thisMonthExpenses,
      lastMonth: lastMonthExpenses,
      dailyAverage,
      targetDate,
    };
  };

  const analytics = calculateAnalytics();
  
  // ✅ UPDATED: Get filtered recent expenses
  const getFilteredExpenses = () => {
    // Filter by category first
    let filteredExpenses = selectedCategory 
      ? expenses.filter(expense => expense.category === selectedCategory.name)
      : expenses;

    // Then filter by date based on mode
    if (dateFilterMode !== 'today' || !isSameDay(selectedDate, new Date())) {
      const targetDate = dateFilterMode === 'yesterday' 
        ? (() => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return yesterday;
          })()
        : selectedDate;

      filteredExpenses = filteredExpenses.filter(expense => {
        return isSameDay(new Date(expense.date), targetDate);
      });
    } else {
      // Today mode - show only today's expenses
      const today = new Date();
      filteredExpenses = filteredExpenses.filter(expense => {
        return isSameDay(new Date(expense.date), today);
      });
    }
    
    return filteredExpenses.slice(0, 8).map(expense => ({
      id: expense.id || '',
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: formatDate(expense.date),
      icon: expense.icon,
    }));
  };

  const recentExpenses = getFilteredExpenses();

  // ✅ NEW: Handle category selection
  const handleSelectCategory = (category: Category | null) => {
    setSelectedCategory(category);
    console.log('🏷️ Category selected:', category?.name || 'All');
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        <ActivityIndicator size="large" color={isDark ? "#3b82f6" : "#2563eb"} />
        <Text className={`mt-4 text-lg ${isDark ? "text-white" : "text-gray-800"}`}>
          Loading expenses from Firebase...
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
              {/* ✅ NEW: Show filter indicator */}
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
              onPress={handleAddExpense}
            >
              <Ionicons
                name="add"
                size={24}
                color={isDark ? "#f3f4f6" : "#374151"}
              />
            </TouchableOpacity>
          </View>

          {/* ✅ UPDATED: Expense Tracking Card - Shows filtered data */}
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
                  {selectedCategory ? `${selectedCategory.name} - ${formatTargetDate()}` : formatTargetDate()}
                </Text>
                <View className="flex-row items-center">
                  {selectedCategory && (
                    <>
                      <Ionicons name="filter" size={12} color="white" />
                      <Text className="text-white text-xs opacity-75 ml-1">Category</Text>
                    </>
                  )}
                  {dateFilterMode !== 'today' && (
                    <>
                      <Ionicons name="calendar" size={12} color="white" />
                      <Text className="text-white text-xs opacity-75 ml-1">Date</Text>
                    </>
                  )}
                </View>
              </View>

              <Text className="text-white text-3xl font-bold">
                Rp {analytics.today.toLocaleString('id-ID')}
              </Text>
              {analytics.today === 0 && (
                <Text className="text-white text-xs opacity-60 mt-1">
                  {selectedCategory ? `No ${selectedCategory.name.toLowerCase()} expenses today` : 'No expenses today'}
                </Text>
              )}

              {/* Daily Average */}
              <View className="mb-4 mt-3">
                <Text className="text-white text-xs opacity-75">
                  Daily Average {selectedCategory ? `(${selectedCategory.name})` : ''}
                </Text>
                <Text className="text-white text-lg font-semibold">
                  Rp {analytics.dailyAverage.toLocaleString('id-ID')}
                </Text>
              </View>

              {/* Monthly Comparison */}
              <View className="flex-row justify-between pt-2 border-t border-white border-opacity-20">
                <View className="flex-1">
                  <Text className="text-white text-xs opacity-75">This Month</Text>
                  <Text className="text-white text-lg font-semibold">
                    {analytics.thisMonth >= 1000000 ? (
                      `Rp ${(analytics.thisMonth / 1000000).toFixed(1)}M`
                    ) : analytics.thisMonth >= 1000 ? (
                      `Rp ${(analytics.thisMonth / 1000).toFixed(0)}K`
                    ) : (
                      `Rp ${analytics.thisMonth.toLocaleString('id-ID')}`
                    )}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-white text-xs opacity-75">Last Month</Text>
                  <Text className="text-white text-lg font-semibold">
                    {analytics.lastMonth >= 1000000 ? (
                      `Rp ${(analytics.lastMonth / 1000000).toFixed(1)}M`
                    ) : analytics.lastMonth >= 1000 ? (
                      `Rp ${(analytics.lastMonth / 1000).toFixed(0)}K`
                    ) : (
                      `Rp ${analytics.lastMonth.toLocaleString('id-ID')}`
                    )}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Categories Section - TETAP ADA */}
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* ✅ NEW: Date Filter - TAMBAHKAN INI */}
        <DateFilterSelector />

        {/* 🔥 REPLACE seluruh Recent Expenses section dengan ini: */}
        {/* ✅ UPDATED: Recent Expenses with Date Filter */}
        <View className="px-6 mt-6 mb-20">
          <View className="flex-row justify-between items-center mb-4">
            <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
              {selectedCategory 
                ? `${selectedCategory.name} - ${formatTargetDate()} (${recentExpenses.length})`
                : `${formatTargetDate()} Expenses (${recentExpenses.length})`
              }
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedCategory(null);
                setDateFilterMode('today');
                setSelectedDate(new Date());
              }}
            >
              <Text className={`font-medium ${
                selectedCategory || dateFilterMode !== 'today'
                  ? isDark ? "text-blue-400" : "text-blue-500"
                  : isDark ? "text-gray-500" : "text-gray-400"
              }`}>
                {selectedCategory || dateFilterMode !== 'today' ? "Reset" : "All"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* SISA bagian expenses list TETAP SAMA */}
          <View className={`rounded-2xl shadow-sm ${isDark ? "bg-gray-800 shadow-gray-900" : "bg-white"}`}>
            {recentExpenses.length === 0 ? (
              <View className="p-8 items-center">
                <Ionicons 
                  name="receipt-outline" 
                  size={48} 
                  color={isDark ? "#6b7280" : "#9ca3af"} 
                />
                <Text className={`mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {selectedCategory 
                    ? `No ${selectedCategory.name.toLowerCase()} expenses yet`
                    : "No expenses yet"
                  }
                </Text>
                <Text className={`text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
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
                  onLongPress={() => {
                    Alert.alert(
                      'Delete Expense',
                      `Delete "${expense.title}"?`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { 
                          text: 'Delete', 
                          style: 'destructive',
                          onPress: async () => {
                            try {
                              await expenseService.delete(expense.id);
                              Alert.alert('Success', 'Expense deleted!');
                            } catch (error) {
                              Alert.alert('Error', 'Failed to delete expense');
                            }
                          }
                        }
                      ]
                    );
                  }}
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
        onSuccess={() => {
          onRefresh();
        }}
      />
    </SafeAreaView>
  );
}