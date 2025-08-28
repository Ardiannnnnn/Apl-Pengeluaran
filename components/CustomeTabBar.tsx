import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    Platform,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
    ViewStyle // ✅ ADD: Import ViewStyle
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface TabItem {
  name: string;
  title: string;
  icon: string;
}

interface CustomTabBarProps {
  tabs: TabItem[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  style?: ViewStyle; // ✅ ADD: Optional style prop
}

export default function CustomTabBar({
  tabs,
  activeIndex,
  onTabPress,
  style, // ✅ ADD: Destructure style prop
}: CustomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Animation for active indicator
  const indicatorPosition = useSharedValue(0);
  const tabWidth = 100 / tabs.length;

  useEffect(() => {
    indicatorPosition.value = withSpring(activeIndex * tabWidth, {
      damping: 20,
      stiffness: 90,
    });
  }, [activeIndex, tabWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${indicatorPosition.value}%` }],
  }));

  return (
    <View 
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}
      style={[
        {
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 8,
          ...Platform.select({
            ios: {
              backgroundColor: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            },
          }),
        },
        style, // ✅ ADD: Apply custom style
      ]}
    >
      {/* Active Indicator */}
      <Animated.View
        style={[
          indicatorStyle,
          {
            position: 'absolute',
            top: 0,
            height: 3,
            width: `${tabWidth}%`,
            backgroundColor: isDark ? '#3b82f6' : '#2563eb',
            borderRadius: 2,
          },
        ]}
      />

      {/* Tab Buttons */}
      <View className="flex-row flex-1">
        {tabs.map((tab, index) => {
          const isActive = activeIndex === index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress(index)}
              className="flex-1 items-center justify-center"
              style={{ paddingVertical: 8 }}
            >
              {/* Icon */}
              <View className="mb-1">
                <Ionicons
                  name={tab.icon as any}
                  size={isActive ? 26 : 24}
                  color={
                    isActive 
                      ? (isDark ? '#3b82f6' : '#2563eb')
                      : (isDark ? '#6b7280' : '#9ca3af')
                  }
                />
              </View>

              {/* Label */}
              <Text
                className={`text-xs font-semibold ${
                  isActive 
                    ? (isDark ? 'text-blue-400' : 'text-blue-500')
                    : (isDark ? 'text-gray-400' : 'text-gray-500')
                }`}
                style={{ opacity: isActive ? 1 : 0.6 }}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}