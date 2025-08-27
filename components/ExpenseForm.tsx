import { Ionicons } from "@expo/vector-icons";
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
  expenseService,
} from "../services/firebaseService";

interface ExpenseFormProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ExpenseForm({
  visible,
  onClose,
  onSuccess,
}: ExpenseFormProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Form states
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Load categories when modal opens
  useEffect(() => {
    if (visible) {
      loadCategories();
      // Reset form
      setAmount("");
      setTitle("");
      setSelectedCategory(null);
    }
  }, [visible]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);

      // Auto-select first category if available
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0]);
      }
    } catch (error) {
      console.error("❌ Error loading categories:", error);
      Alert.alert("Error", "Failed to load categories");
    } finally {
      setLoadingCategories(false);
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

    try {
      setLoading(true);

      const expenseData = {
        title: title.trim(),
        amount: numericAmount,
        category: selectedCategory.name,
        date: new Date(),
        icon: selectedCategory.icon,
      };

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
    } catch (error) {
      console.error("❌ Error adding expense:", error);
      Alert.alert("❌ Error", "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (text: string) => {
    // Remove non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");

    // Format with thousands separator
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
              Add Expense
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
                <Text className="text-white font-semibold">Save</Text>
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
                autoFocus
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
                        color={category.iconColor} // ✅ SELALU gunakan warna asli icon
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

                    {/* ✅ HANYA 1 checkmark di pojok atas kanan */}
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

          {/* Preview */}
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
                    {selectedCategory.name} • Today
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
      </View>
    </Modal>
  );
}
