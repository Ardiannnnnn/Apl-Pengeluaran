import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../services/firebaseService';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export default function CategorySelector({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}: CategorySelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View className="px-6 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text
          className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-800"}`}
        >
          Categories ({categories.length})
        </Text>
        <TouchableOpacity
          onPress={() => onSelectCategory(null)}
        >
          <Text
            className={`font-medium ${
              selectedCategory 
                ? isDark ? "text-blue-400" : "text-blue-500"
                : isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {selectedCategory ? "See All" : "All"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-2"
      >
        {categories.length === 0 ? (
          <Text className={`mx-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
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
                <View
                  className={`p-4 rounded-2xl w-20 h-20 justify-center items-center ${
                    isSelected 
                      ? isDark 
                        ? "bg-blue-600 border-2 border-blue-400" 
                        : "bg-blue-500 border-2 border-blue-300"
                      : category.color
                  }`}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={28}
                    color={isSelected ? "white" : category.iconColor}
                  />
                </View>
                <Text
                  className={`text-center text-sm mt-2 font-medium ${
                    isSelected
                      ? isDark ? "text-blue-400" : "text-blue-500"
                      : isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {category.name}
                </Text>
                {isSelected && (
                  <View className="absolute -top-1 -right-1">
                    <View className={`w-4 h-4 rounded-full justify-center items-center ${
                      isDark ? "bg-blue-400" : "bg-blue-500"
                    }`}>
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