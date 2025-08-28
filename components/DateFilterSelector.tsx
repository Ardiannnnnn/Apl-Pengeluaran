import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { DateFilterMode } from '../utils/dateUtils';
import CustomDatePicker from './CustomDatePicker';

interface DateFilterSelectorProps {
  dateFilterMode: DateFilterMode;
  selectedDate: Date;
  onDateFilterChange: (mode: DateFilterMode, date: Date) => void;
}

export default function DateFilterSelector({
  dateFilterMode,
  selectedDate,
  onDateFilterChange,
}: DateFilterSelectorProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleTodayPress = () => {
    onDateFilterChange('today', new Date());
  };

  const handleYesterdayPress = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    onDateFilterChange('yesterday', yesterday);
  };

  const handleCustomPress = () => {
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date) => {
    onDateFilterChange('custom', date);
    setShowDatePicker(false);
  };

  // ✅ Function to close modal
  const closeModal = () => {
    setShowDatePicker(false);
  };

  const formatCustomDate = (date: Date) => {
    try {
      return date.toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (error) {
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
  };

  return (
    <>
      <View className="px-6 mt-4">
        <Text className={`text-sm font-semibold mb-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Filter by Date
        </Text>
        
        <View className="flex-row gap-2">
          {/* Today Button */}
          <TouchableOpacity
            onPress={handleTodayPress}
            className={`flex-1 px-3 py-2 rounded-xl flex-row items-center justify-center ${
              dateFilterMode === 'today'
                ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                : isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Ionicons 
              name="today" 
              size={16} 
              color={
                dateFilterMode === 'today' 
                  ? 'white' 
                  : isDark ? '#d1d5db' : '#374151'
              } 
            />
            <Text className={`font-medium ml-2 ${
              dateFilterMode === 'today' 
                ? 'text-white' 
                : isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Today
            </Text>
          </TouchableOpacity>

          {/* Yesterday Button */}
          <TouchableOpacity
            onPress={handleYesterdayPress}
            className={`flex-1 px-3 py-2 rounded-xl flex-row items-center justify-center ${
              dateFilterMode === 'yesterday'
                ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                : isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <Ionicons 
              name="arrow-back" 
              size={16} 
              color={
                dateFilterMode === 'yesterday' 
                  ? 'white' 
                  : isDark ? '#d1d5db' : '#374151'
              } 
            />
            <Text className={`font-medium ml-2 ${
              dateFilterMode === 'yesterday' 
                ? 'text-white' 
                : isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Yesterday
            </Text>
          </TouchableOpacity>

          {/* Custom Date Button */}
          <TouchableOpacity
            onPress={handleCustomPress}
            className={`flex-1 px-3 py-2 rounded-xl ${
              dateFilterMode === 'custom'
                ? isDark ? 'bg-blue-600' : 'bg-blue-500'
                : isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons 
                name="calendar" 
                size={16} 
                color={
                  dateFilterMode === 'custom' 
                    ? 'white' 
                    : isDark ? '#d1d5db' : '#374151'
                } 
              />
              <View className="ml-2">
                <Text className={`font-medium ${
                  dateFilterMode === 'custom' 
                    ? 'text-white' 
                    : isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Custom
                </Text>
                {dateFilterMode === 'custom' && (
                  <Text className="text-white text-xs opacity-75 -mt-1">
                    {formatCustomDate(selectedDate)}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Custom Date Picker Modal with Touch Outside to Close */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={closeModal} // ✅ Handle hardware back button
      >
        {/* ✅ Touchable Background Overlay */}
        <TouchableOpacity 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0, 0, 0, 0.5)' 
          }}
          activeOpacity={1} // ✅ Prevent opacity change on press
          onPress={closeModal} // ✅ Close modal when pressed outside
        >
          <View className="flex-1 justify-end">
            {/* ✅ TouchableOpacity to prevent event bubbling */}
            <TouchableOpacity 
              activeOpacity={1} 
              onPress={(e) => e.stopPropagation()} // ✅ Prevent closing when touching modal content
            >
              <View className={`${
                isDark ? 'bg-gray-800' : 'bg-white'
              } rounded-t-3xl p-6`}>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <TouchableOpacity onPress={closeModal}>
                    <Text className={`text-base font-medium ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Batal
                    </Text>
                  </TouchableOpacity>
                  
                  <Text className={`text-lg font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Pilih Tanggal Filter
                  </Text>
                  
                  <View style={{ width: 50 }} />
                </View>

                {/* Custom Date Picker */}
                <CustomDatePicker
                  value={selectedDate}
                  onDateChange={handleDateSelect}
                  placeholder="Pilih tanggal untuk filter"
                  maximumDate={new Date()}
                />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}