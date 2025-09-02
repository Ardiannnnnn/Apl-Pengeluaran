import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  Category,
  categoryService,
  Expense,
  expenseService,
} from "../services/firebaseService";

// ✅ Date Mode Type - hanya untuk add mode
type DateMode = "today" | "yesterday" | "custom";

interface ExpenseFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editMode?: boolean;
  editExpense?: Expense | null;
}

export default function ExpenseForm({
  visible,
  onClose,
  onSuccess,
  editMode = false,
  editExpense = null,
}: ExpenseFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Form states
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ Date states - hanya untuk add mode
  const [dateMode, setDateMode] = useState<DateMode>("today");
  const [customDate, setCustomDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // ✅ Enhanced helper function to handle various date formats
  const getSafeDate = (dateValue: any): Date => {
    if (!dateValue) {
      console.warn('⚠️ Empty date value, using current date');
      return new Date();
    }
    
    // If it's already a Date object
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      console.log('✅ Valid Date object found');
      return dateValue;
    }
    
    // If it's a string
    if (typeof dateValue === 'string') {
      // Handle special text values
      if (dateValue.toLowerCase() === 'today') {
        console.log('✅ Converting "today" string to Date');
        return new Date();
      }
      
      if (dateValue.toLowerCase() === 'yesterday') {
        console.log('✅ Converting "yesterday" string to Date');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      }
      
      // Try to parse as ISO date string
      const parsedDate = new Date(dateValue);
      if (!isNaN(parsedDate.getTime())) {
        console.log('✅ Successfully parsed ISO date string');
        return parsedDate;
      }
      
      console.warn('⚠️ Unable to parse date string:', dateValue);
    }
    
    // If it's a Firestore Timestamp
    if (dateValue?.toDate && typeof dateValue.toDate === 'function') {
      console.log('✅ Converting Firestore Timestamp');
      return dateValue.toDate();
    }
    
    // If it's a number (timestamp)
    if (typeof dateValue === 'number') {
      console.log('✅ Converting timestamp number');
      return new Date(dateValue);
    }
    
    console.error('❌ Invalid date format:', typeof dateValue, dateValue);
    console.log('🔄 Fallback to current date');
    return new Date();
  };

  useEffect(() => {
    if (visible) {
      loadCategories();
      
      if (editMode && editExpense) {
        // ✅ EDIT MODE: Populate form dengan data existing
        console.log('🔍 Debug editExpense date:', {
          id: editExpense.id,
          title: editExpense.title,
          rawDate: editExpense.date,
          dateType: typeof editExpense.date,
          isDateInstance: editExpense.date instanceof Date,
          safeDate: getSafeDate(editExpense.date).toISOString(),
        });
        
        setAmount(editExpense.amount.toLocaleString("id-ID"));
        setTitle(editExpense.title);
      } else {
        // ✅ ADD MODE: Reset form
        setAmount("");
        setTitle("");
        setSelectedCategory(null);
        setDateMode("today");
        setCustomDate(new Date());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editMode, editExpense]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);

      if (editMode && editExpense) {
        // ✅ EDIT MODE: Find dan set matching category
        const matchingCategory = categoriesData.find(
          cat => cat.name === editExpense.category
        );
        setSelectedCategory(matchingCategory || null);
      } else {
        // ✅ ADD MODE: Auto-select first category
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0]);
        }
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  // ✅ Get expense date with proper error handling
  const getExpenseDate = (): Date => {
    if (editMode && editExpense) {
      // ✅ EDIT MODE: Convert original date safely
      const safeDate = getSafeDate(editExpense.date);
      
      console.log('📅 Edit mode - converting original date:', {
        original: editExpense.date,
        originalType: typeof editExpense.date,
        converted: safeDate.toISOString(),
        convertedDateString: safeDate.toDateString(),
        isValidDate: !isNaN(safeDate.getTime()),
      });
      
      return safeDate;
    }

    // ✅ ADD MODE: Gunakan tanggal sesuai mode
    switch (dateMode) {
      case "today":
        return new Date();
      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
      case "custom":
        return customDate;
      default:
        return new Date();
    }
  };

  // ✅ Format date for display - hanya untuk add mode
  const formatDateDisplay = (): string => {
    switch (dateMode) {
      case "today":
        return "Today";
      case "yesterday":
        return "Yesterday";
      case "custom":
        return customDate.toLocaleDateString("id-ID", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      default:
        return "Today";
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!amount.trim()) {
      Alert.alert("Error", "Please enter an amount");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    const numericAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    // ✅ ADD validation for edit mode
    if (editMode && (!editExpense || !editExpense.id)) {
      Alert.alert("Error", "Invalid expense data for editing");
      return;
    }

    try {
      setLoading(true);

      // ✅ Get expense date with safe conversion
      const expenseDate = getExpenseDate();
      
      // ✅ Enhanced date validation
      if (!expenseDate || !(expenseDate instanceof Date) || isNaN(expenseDate.getTime())) {
        console.error('❌ Date validation failed:', {
          expenseDate,
          isDate: expenseDate instanceof Date,
          isValid: expenseDate ? !isNaN(expenseDate.getTime()) : false,
          originalDate: editExpense?.date,
          mode: editMode ? 'edit' : 'add',
        });
        Alert.alert("Error", "Invalid date detected. Please try again.");
        return;
      }

      console.log('💾 Saving expense with validated date:', {
        mode: editMode ? 'edit' : 'add',
        originalRawDate: editMode ? editExpense?.date : 'N/A',
        finalDate: expenseDate.toISOString(),
        finalDateString: expenseDate.toDateString(),
        isValidDate: !isNaN(expenseDate.getTime()),
      });

      const expenseData = {
        title: title.trim(),
        amount: numericAmount,
        category: selectedCategory.name,
        date: expenseDate, // ✅ Guaranteed to be valid Date object
        icon: selectedCategory.icon,
      };

      if (editMode && editExpense && editExpense.id) {
        // ✅ UPDATE existing expense
        await expenseService.update(editExpense.id, expenseData);
        Alert.alert("✅ Success", "Expense updated successfully!", [
          {
            text: "OK",
            onPress: () => {
              onSuccess?.();
              onClose();
            },
          },
        ]);
      } else {
        // ✅ CREATE new expense
        await expenseService.create(expenseData);
        Alert.alert("✅ Success", "Expense added successfully!", [
          {
            text: "OK",
            onPress: () => {
              onSuccess?.();
              onClose();
            },
          },
        ]);
      }
    } catch (error) {
      console.error("❌ Error saving expense:", error);
      Alert.alert("❌ Error", `Failed to ${editMode ? 'update' : 'add'} expense`);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue) {
      const formatted = parseInt(numericValue).toLocaleString("id-ID");
      setAmount(formatted);
    } else {
      setAmount("");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {/* Header */}
        <View
          className={`px-6 py-4 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
        >
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose} className="p-2">
              <Ionicons
                name="close"
                size={24}
                color={isDark ? "#f3f4f6" : "#374151"}
              />
            </TouchableOpacity>

            <Text
              className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
            >
              {editMode ? "Edit Expense" : "Add Expense"}
            </Text>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`px-4 py-2 rounded-full ${
                loading ? "bg-gray-400" : isDark ? "bg-blue-600" : "bg-blue-500"
              }`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-semibold">
                  {editMode ? "Update" : "Save"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Amount Input */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Amount
            </Text>
            <View
              className={`flex-row items-center p-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <Text
                className={`text-xl font-bold mr-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Rp
              </Text>
              <TextInput
                value={amount}
                onChangeText={formatAmount}
                placeholder="0"
                placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                keyboardType="numeric"
                className={`flex-1 text-2xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}
                autoFocus={!editMode} // ✅ Only autofocus in add mode
              />
            </View>
          </View>

          {/* Description Input */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Description
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="What did you spend on?"
              placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
              className={`p-4 rounded-2xl text-lg ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
              multiline
              numberOfLines={2}
            />
          </View>

          {/* ✅ Date Selection - HANYA untuk ADD MODE */}
          {!editMode && (
            <View className="mb-6">
              <Text
                className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Date
              </Text>

              {/* Date Mode Buttons */}
              <View className="flex-row mb-3">
                <TouchableOpacity
                  onPress={() => setDateMode("today")}
                  className={`flex-1 p-3 rounded-l-xl border-r ${
                    dateMode === "today"
                      ? isDark ? "bg-blue-600 border-blue-500" : "bg-blue-500 border-blue-400"
                      : isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    dateMode === "today" ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Today
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDateMode("yesterday")}
                  className={`flex-1 p-3 border-r ${
                    dateMode === "yesterday"
                      ? isDark ? "bg-blue-600 border-blue-500" : "bg-blue-500 border-blue-400"
                      : isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    dateMode === "yesterday" ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Yesterday
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDateMode("custom")}
                  className={`flex-1 p-3 rounded-r-xl ${
                    dateMode === "custom"
                      ? isDark ? "bg-blue-600 border-blue-500" : "bg-blue-500 border-blue-400"
                      : isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`text-center font-medium ${
                    dateMode === "custom" ? "text-white" : isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Custom
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Custom Date Picker */}
              {dateMode === "custom" && (
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className={`p-4 rounded-xl flex-row items-center justify-between ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                    />
                    <Text className={`ml-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                      {customDate.toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? "#6b7280" : "#9ca3af"}
                  />
                </TouchableOpacity>
              )}

              {/* Date Display */}
              <View className={`mt-2 p-3 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
                <Text className={`text-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  Expense will be saved for: <Text className="font-semibold">{formatDateDisplay()}</Text>
                </Text>
              </View>
            </View>
          )}

          {/* Category Selection */}
          <View className="mb-6">
            <Text
              className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
            >
              Category
            </Text>

            {loadingCategories ? (
              <View
                className={`p-8 rounded-2xl items-center ${isDark ? "bg-gray-800" : "bg-white"}`}
              >
                <ActivityIndicator
                  size="large"
                  color={isDark ? "#3b82f6" : "#2563eb"}
                />
                <Text
                  className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Loading categories...
                </Text>
              </View>
            ) : categories.length === 0 ? (
              <View
                className={`p-8 rounded-2xl items-center ${isDark ? "bg-gray-800" : "bg-white"}`}
              >
                <Ionicons
                  name="folder-outline"
                  size={48}
                  color={isDark ? "#6b7280" : "#9ca3af"}
                />
                <Text
                  className={`mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  No categories available
                </Text>
                <Text
                  className={`text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}
                >
                  Add categories in Firebase Console
                </Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-1"
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    onPress={() => setSelectedCategory(category)}
                    className={`mx-1 p-4 rounded-2xl min-w-[100px] items-center ${
                      selectedCategory?.id === category.id
                        ? isDark
                          ? "bg-blue-600 border-2 border-blue-400"
                          : "bg-blue-500 border-2 border-blue-300"
                        : isDark
                          ? "bg-gray-800"
                          : "bg-white"
                    }`}
                  >
                    <View
                      className={`p-3 rounded-full mb-2 ${
                        selectedCategory?.id === category.id
                          ? "bg-white bg-opacity-20"
                          : category.color
                      }`}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={24}
                        color={category.iconColor}
                      />
                    </View>
                    <Text
                      className={`text-sm font-medium text-center ${
                        selectedCategory?.id === category.id
                          ? "text-white"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                      }`}
                    >
                      {category.name}
                    </Text>

                    {selectedCategory?.id === category.id && (
                      <View className="absolute -top-1 -right-1">
                        <View className="w-6 h-6 bg-green-500 rounded-full justify-center items-center">
                          <Ionicons name="checkmark" size={14} color="white" />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* ✅ Preview - Updated to show date only in add mode */}
          {amount && title && selectedCategory && (
            <View
              className={`p-4 rounded-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <Text
                className={`text-sm font-medium mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                Preview
              </Text>
              <View className="flex-row items-center">
                <View
                  className={`p-2 rounded-full mr-3 ${selectedCategory.color}`}
                >
                  <Ionicons
                    name={selectedCategory.icon as any}
                    size={20}
                    color={selectedCategory.iconColor}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
                  >
                    {title}
                  </Text>
                  <Text
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {/* ✅ Show date only in add mode, category only in edit mode */}
                    {editMode ? selectedCategory.name : `${selectedCategory.name} • ${formatDateDisplay()}`}
                  </Text>
                </View>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-red-400" : "text-red-500"}`}
                >
                  -Rp {amount}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ✅ Date Picker Modal - HANYA untuk ADD MODE */}
        {!editMode && showDatePicker && (
          <DateTimePicker
            value={customDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setCustomDate(selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}
      </View>
    </Modal>
  );
}
