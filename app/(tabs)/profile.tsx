import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const menuItems = [
    {
      icon: "notifications-outline",
      title: "Notifications",
      subtitle: "App notifications",
      hasNotification: true,
    },
    {
      icon: "shield-checkmark-outline",
      title: "Privacy & Security",
      subtitle: "Data protection settings",
      hasNotification: false,
    },
    {
      icon: "download-outline",
      title: "Export Data",
      subtitle: "Download your expense data",
      hasNotification: false,
    },
    {
      icon: "help-circle-outline",
      title: "Help & Support",
      subtitle: "FAQs and contact us",
      hasNotification: false,
    },
    {
      icon: "information-circle-outline",
      title: "About",
      subtitle: "App version and info",
      hasNotification: false,
    },
  ];

  const handleMenuPress = (title: string) => {
    Alert.alert(title, `${title} feature coming soon!`);
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

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
    <SafeAreaView
      className={`flex-1 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-6 px-6">
          <Text
            className={`text-2xl font-bold ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            Profile
          </Text>
         
        </View>

        {/* Profile Card */}
        <View className="px-6 mb-6">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } p-6 rounded-2xl shadow-sm`}
          >
            {/* Profile Info */}
            <View className="items-center mb-6">
              <View className="relative mb-4">
                <View className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center">
                  <Text className="text-white text-xl font-bold">JD</Text>
                </View>
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-blue-500 w-7 h-7 rounded-full items-center justify-center border-2 border-white"
                >
                  <Ionicons name="pencil" size={12} color="white" />
                </TouchableOpacity>
              </View>

              <Text
                className={`text-xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                John Doe
              </Text>
              <Text
                className={`${
                  isDark ? "text-gray-400" : "text-gray-500"
                } text-sm mt-1`}
              >
                john.doe@email.com
              </Text>
              <Text
                className={`${
                  isDark ? "text-gray-500" : "text-gray-400"
                } text-xs mt-1`}
              >
                Member since January 2024
              </Text>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity
              onPress={handleEditProfile}
              className={`${
                isDark ? "bg-blue-600" : "bg-blue-500"
              } p-3 rounded-xl flex-row items-center justify-center`}
            >
              <Ionicons name="person-outline" size={16} color="white" />
              <Text className="text-white font-medium ml-2">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-6 mb-6">
          <Text
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-800"
            } mb-4`}
          >
            Settings
          </Text>
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-sm overflow-hidden`}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleMenuPress(item.title)}
                className={`p-4 flex-row items-center justify-between ${
                  index !== menuItems.length - 1
                    ? `border-b ${
                        isDark ? "border-gray-700" : "border-gray-100"
                      }`
                    : ""
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    } p-3 rounded-full mr-4`}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={isDark ? "#9ca3af" : "#6b7280"}
                    />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text
                        className={`font-semibold ${
                          isDark ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {item.title}
                      </Text>
                      {item.hasNotification && (
                        <View className="bg-red-500 w-2 h-2 rounded-full ml-2" />
                      )}
                    </View>
                    <Text
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {item.subtitle}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={isDark ? "#6b7280" : "#d1d5db"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View className="px-6 mb-6">
          <View
            className={`${
              isDark ? "bg-gray-800" : "bg-white"
            } p-4 rounded-2xl shadow-sm`}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                App Version
              </Text>
              <Text
                className={`${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                1.0.0
              </Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                Build Number
              </Text>
              <Text
                className={`${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                100
              </Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleLogout}
            className={`${
              isDark
                ? "bg-red-900/20 border-red-800"
                : "bg-red-50 border-red-200"
            } border p-4 rounded-2xl flex-row items-center justify-center`}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={isDark ? "#f87171" : "#dc2626"}
            />
            <Text
              className={`${
                isDark ? "text-red-400" : "text-red-600"
              } font-semibold ml-2`}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
