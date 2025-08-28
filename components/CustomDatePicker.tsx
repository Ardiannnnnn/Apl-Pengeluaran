import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

interface CustomDatePickerProps {
  value: Date;
  onDateChange: (date: Date) => void;
  placeholder?: string;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
}

export default function CustomDatePicker({
  value,
  onDateChange,
  placeholder = "Pilih tanggal",
  label,
  mode = 'date',
  minimumDate,
  maximumDate,
  disabled = false,
}: CustomDatePickerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  const formatDate = (date: Date) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      if (mode === 'time') {
        return date.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      }
      
      if (mode === 'datetime') {
        const dateStr = date.toLocaleDateString('id-ID', options);
        const timeStr = date.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        return `${dateStr} ${timeStr}`;
      }
      
      return date.toLocaleDateString('id-ID', options);
    } catch (error) {
      // ✅ Fallback formatting if locale fails
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (selectedDate) {
      setTempDate(selectedDate);
      if (Platform.OS === 'android') {
        onDateChange(selectedDate);
      }
    }
  };

  const handleConfirm = () => {
    onDateChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value);
    setShow(false);
  };

  // ✅ Ensure we have valid dates
  const displayValue = value ? formatDate(value) : placeholder;

  return (
    <View className="mb-4">
      {/* Label */}
      {label && (
        <Text className={`text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </Text>
      )}

      {/* Date Input Button */}
      <TouchableOpacity
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        className={`flex-row items-center justify-between p-4 rounded-xl border ${
          disabled 
            ? (isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300')
            : (isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300')
        }`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center flex-1">
          <Ionicons
            name="calendar-outline"
            size={20}
            color={
              disabled
                ? (isDark ? '#6b7280' : '#9ca3af')
                : (isDark ? '#3b82f6' : '#2563eb')
            }
            style={{ marginRight: 12 }}
          />
          {/* ✅ Always wrap in Text component */}
          <Text className={`flex-1 ${
            disabled
              ? (isDark ? 'text-gray-500' : 'text-gray-400')
              : (isDark ? 'text-white' : 'text-gray-900')
          }`}>
            {displayValue}
          </Text>
        </View>
        
        <Ionicons
          name="chevron-down-outline"
          size={16}
          color={
            disabled
              ? (isDark ? '#6b7280' : '#9ca3af')
              : (isDark ? '#6b7280' : '#9ca3af')
          }
        />
      </TouchableOpacity>

      {/* Date Picker Modal/Native */}
      {show && (
        <>
          {Platform.OS === 'ios' ? (
            /* ✅ iOS Modal with Touch Outside to Close */
            <Modal
              animationType="slide"
              transparent={true}
              visible={show}
              onRequestClose={handleCancel}
            >
              {/* ✅ Touchable Background */}
              <TouchableOpacity 
                style={{ 
                  flex: 1, 
                  backgroundColor: 'rgba(0, 0, 0, 0.5)' 
                }}
                activeOpacity={1}
                onPress={handleCancel} // ✅ Close when pressed outside
              >
                <View className="flex-1 justify-end">
                  {/* ✅ Prevent event bubbling on modal content */}
                  <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={(e) => e.stopPropagation()}
                  >
                    <View className={`${
                      isDark ? 'bg-gray-800' : 'bg-white'
                    } rounded-t-3xl p-6`}>
                      {/* Header */}
                      <View className="flex-row justify-between items-center mb-4">
                        <TouchableOpacity onPress={handleCancel}>
                          <Text className={`text-base font-medium ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Batal
                          </Text>
                        </TouchableOpacity>
                        
                        <Text className={`text-lg font-semibold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {mode === 'date' ? 'Pilih Tanggal' : mode === 'time' ? 'Pilih Waktu' : 'Pilih Tanggal & Waktu'}
                        </Text>
                        
                        <TouchableOpacity onPress={handleConfirm}>
                          <Text className="text-base font-medium text-blue-500">
                            Selesai
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Date Picker */}
                      <DateTimePicker
                        value={tempDate}
                        mode={mode}
                        display="spinner"
                        onChange={handleDateChange}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        textColor={isDark ? '#ffffff' : '#000000'}
                        themeVariant={isDark ? 'dark' : 'light'}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
          ) : (
            /* Android Native Picker - no changes needed */
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="default"
              onChange={handleDateChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
            />
          )}
        </>
      )}
    </View>
  );
}