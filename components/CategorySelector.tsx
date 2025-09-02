import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Category } from "../services/firebaseService";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

// ✅ Helper function to convert Tailwind color to hex
const getTailwindColor = (colorClass: string): string => {
  const colorMap: { [key: string]: string } = {
    "bg-red-100": "#fee2e2",
    "bg-red-200": "#fecaca",
    "bg-red-500": "#ef4444",
    "bg-blue-100": "#dbeafe",
    "bg-blue-200": "#bfdbfe",
    "bg-blue-500": "#3b82f6",
    "bg-green-100": "#dcfce7",
    "bg-green-200": "#bbf7d0",
    "bg-green-500": "#22c55e",
    "bg-yellow-100": "#fef3c7",
    "bg-yellow-200": "#fde68a",
    "bg-yellow-500": "#eab308",
    "bg-purple-100": "#f3e8ff",
    "bg-purple-200": "#e9d5ff",
    "bg-purple-500": "#a855f7",
    "bg-pink-100": "#fce7f3",
    "bg-pink-200": "#fbcfe8",
    "bg-pink-500": "#ec4899",
    "bg-orange-100": "#fed7aa",
    "bg-orange-200": "#fed7aa",
    "bg-orange-500": "#f97316",
    "bg-gray-100": "#f3f4f6",
    "bg-gray-200": "#e5e7eb",
    "bg-gray-500": "#6b7280",
  };

  return colorMap[colorClass] || "#f3f4f6"; // fallback to gray-100
};

export default function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="px-6 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
        >
          Categories
        </Text>
        <Text
          className={`font-medium ${
            selectedCategory
              ? isDark
                ? "text-blue-400"
                : "text-blue-500"
              : isDark
                ? "text-gray-500"
                : "text-gray-400"
          }`}
        >
          total: {categories.length}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-2"
      >
        {categories.length === 0 ? (
          <Text
            className={`mx-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            No categories yet. Add some categories first.
          </Text>
        ) : (
          categories.map((category, index) => {
            const isSelected = selectedCategory?.id === category.id;

            return (
              <TouchableOpacity
                key={category.id || index}
                className="mx-2"
                onPress={() => onSelectCategory(isSelected ? null : category)}
              >
                {/* ✅ FIXED: Use inline style for reliable background color */}
                <View
                  className="p-4 rounded-xl w-20 h-20 justify-center items-center"
                  style={{
                    backgroundColor: isSelected
                      ? "transparent" // ✅ CHANGED: No background when selected
                      : getTailwindColor(category.color), // ✅ Keep original background when not selected
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: isSelected
                      ? isDark
                        ? "#60a5fa" // blue-400
                        : "#3b82f6" // blue-500
                      : "transparent",
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={category.iconColor} // ✅ Keep original icon color always
                  />
                </View>
                <Text
                  className={`text-center text-sm mt-2 font-medium ${
                    isSelected
                      ? isDark
                        ? "text-blue-400"
                        : "text-blue-500"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
                {isSelected && (
                  <View className="absolute -top-1 -right-1">
                    <View
                      className={`w-4 h-4 rounded-full justify-center items-center ${
                        isDark ? "bg-blue-400" : "bg-blue-500"
                      }`}
                    >
                      <Ionicons name="checkmark" size={10} color="white" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}
