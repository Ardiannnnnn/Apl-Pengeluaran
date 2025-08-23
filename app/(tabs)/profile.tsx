import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const profileStats = [
    {
      label: "Total Expenses",
      value: "Rp 1,250,000",
      icon: "trending-down",
      color: "text-red-500",
    },
    {
      label: "Total Income",
      value: "Rp 3,500,000",
      icon: "trending-up",
      color: "text-green-500",
    },
    {
      label: "Savings",
      value: "Rp 2,250,000",
      icon: "wallet",
      color: "text-blue-500",
    },
  ];

  const menuItems = [
    {
      icon: "card",
      title: "Payment Methods",
      subtitle: "Manage your cards",
      hasNotification: false,
    },
    {
      icon: "notifications",
      title: "Notifications",
      subtitle: "App notifications",
      hasNotification: true,
    },
    {
      icon: "shield-checkmark",
      title: "Security",
      subtitle: "Privacy & security",
      hasNotification: false,
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      subtitle: "FAQs and contact",
      hasNotification: false,
    },
    {
      icon: "document-text",
      title: "Terms & Conditions",
      subtitle: "Legal information",
      hasNotification: false,
    },
  ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout pressed"),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white px-6 pt-4 pb-6">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-gray-800">Profile</Text>
            <TouchableOpacity className="bg-gray-100 p-2 rounded-full">
              <Ionicons name="settings-outline" size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Profile Info */}
          <View className="items-center">
            <View className="relative mb-4">
              <View className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center">
                <Text className="text-white text-2xl font-bold">JD</Text>
              </View>
              <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 w-8 h-8 rounded-full items-center justify-center border-2 border-white">
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>

            <Text className="text-xl font-bold text-gray-800">John Doe</Text>
            <Text className="text-gray-500 text-sm">john.doe@email.com</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Member since January 2024
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Financial Overview
          </Text>
          <View className="space-y-3">
            {profileStats.map((stat, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-2xl shadow-sm flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-gray-100 p-3 rounded-full mr-4">
                    <Ionicons
                      name={stat.icon as any}
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                  <View>
                    <Text className="text-gray-500 text-sm">{stat.label}</Text>
                    <Text className={`text-lg font-bold ${stat.color}`}>
                      {stat.value}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm flex-1 mr-2 items-center">
              <View className="bg-blue-100 p-3 rounded-full mb-2">
                <Ionicons name="download" size={20} color="#2563eb" />
              </View>
              <Text className="text-gray-700 font-medium text-center">
                Export Data
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white p-4 rounded-2xl shadow-sm flex-1 mx-1 items-center">
              <View className="bg-green-100 p-3 rounded-full mb-2">
                <Ionicons name="share" size={20} color="#059669" />
              </View>
              <Text className="text-gray-700 font-medium text-center">
                Share Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mt-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Settings</Text>
          <View className="bg-white rounded-2xl shadow-sm">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                className={`p-4 flex-row items-center justify-between ${
                  index !== menuItems.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-gray-100 p-3 rounded-full mr-4">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color="#6b7280"
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="font-semibold text-gray-800">
                        {item.title}
                      </Text>
                      {item.hasNotification && (
                        <View className="bg-red-500 w-2 h-2 rounded-full ml-2" />
                      )}
                    </View>
                    <Text className="text-sm text-gray-500">
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="px-6 mt-6">
          <View className="bg-white p-4 rounded-2xl shadow-sm">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="font-semibold text-gray-800">App Version</Text>
              <Text className="text-gray-500">1.0.0</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-800">Build Number</Text>
              <Text className="text-gray-500">100</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mt-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 border border-red-200 p-4 rounded-2xl flex-row items-center justify-center"
          >
            <Ionicons name="log-out-outline" size={20} color="#dc2626" />
            <Text className="text-red-600 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
