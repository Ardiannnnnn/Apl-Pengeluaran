import React, { useState, useRef } from 'react';
import PagerView from 'react-native-pager-view';
import { View, useColorScheme, TouchableOpacity, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../app/(tabs)/index';
import StatistikScreen from '../app/(tabs)/statistik';
import ProfileScreen from '../app/(tabs)/profile';

export default function MainViewPager() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const tabs = [
    { key: 'home', title: 'Home', icon: 'home' },
    { key: 'statistik', title: 'Statistik', icon: 'pie-chart' },
    { key: 'profile', title: 'Profile', icon: 'person' },
  ];

  const onPageSelected = (event: any) => {
    setCurrentPage(event.nativeEvent.position);
  };

  const navigateToPage = (pageIndex: number) => {
    pagerRef.current?.setPage(pageIndex);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* ViewPager */}
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={onPageSelected}
      >
        {/* Page 0: Home */}
        <View key="home" style={{ flex: 1 }}>
          <HomeScreen />
        </View>

        {/* Page 1: Statistik */}
        <View key="statistik" style={{ flex: 1 }}>
          <StatistikScreen />
        </View>

        {/* Page 2: Profile */}
        <View key="profile" style={{ flex: 1 }}>
          <ProfileScreen />
        </View>
      </PagerView>

      {/* Custom Tab Bar */}
      <View
        style={{
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 24 : 12,
          paddingTop: 8,
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#374151' : '#e5e7eb',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20 }}>
          {tabs.map((tab, index) => {
            const isActive = currentPage === index;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => navigateToPage(index)}
                style={{
                  alignItems: 'center',
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  flex: 1,
                }}
              >
                <Ionicons
                  name={isActive ? tab.icon as any : `${tab.icon}-outline` as any}
                  size={isActive ? 26 : 24}
                  color={isActive ? (isDark ? "#3b82f6" : "#2563eb") : (isDark ? "#6b7280" : "#9ca3af")}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: 4,
                    color: isActive ? (isDark ? "#3b82f6" : "#2563eb") : (isDark ? "#6b7280" : "#9ca3af")
                  }}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}