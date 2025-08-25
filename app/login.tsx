import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { signInWithGoogle, loading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header Section */}
      <View className="flex-1 justify-center px-6">
        {/* App Icon & Branding */}
        <View className="items-center mb-12">
          <LinearGradient
            colors={isDark ? ["#1e40af", "#7c3aed"] : ["#3b82f6", "#8b5cf6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-28 h-28 rounded-3xl items-center justify-center mb-8"
          >
            <Ionicons name="wallet-outline" size={56} color="white" />
          </LinearGradient>

          <Text
            className={`text-4xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            APL Pengeluaran
          </Text>
          <Text
            className={`text-lg text-center leading-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Kelola pengeluaran harian Anda{"\n"}dengan mudah dan efisien
          </Text>
        </View>

        {/* Features Preview */}
        <View className="mb-10">
          <View className="flex-row items-center mb-4">
            <View
              className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${isDark ? "bg-gray-800" : "bg-blue-50"}`}
            >
              <Ionicons
                name="analytics-outline"
                size={24}
                color={isDark ? "#60a5fa" : "#3b82f6"}
              />
            </View>
            <View className="flex-1">
              <Text
                className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"}`}
              >
                Tracking Real-time
              </Text>
              <Text
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Pantau pengeluaran harian, mingguan, dan bulanan
              </Text>
            </View>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={signInWithGoogle}
          disabled={loading}
          className={`p-4 rounded-2xl flex-row items-center justify-center shadow-lg mb-4 ${
            isDark ? "bg-white" : "bg-white"
          } ${loading ? "opacity-70" : ""}`}
          style={{
            shadowColor: isDark ? "#000" : "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="logo-google" size={24} color="#4285f4" />
          <Text className="text-gray-700 font-semibold ml-3 text-lg">
            {loading ? "Sedang Masuk..." : "Masuk dengan Google"}
          </Text>
        </TouchableOpacity>

        {/* Terms & Privacy */}
        <Text
          className={`text-center text-xs leading-5 ${isDark ? "text-gray-500" : "text-gray-500"}`}
        >
          Dengan masuk, Anda menyetujui{" "}
          <Text className={isDark ? "text-blue-400" : "text-blue-600"}>
            Syarat Layanan
          </Text>{" "}
          dan{" "}
          <Text className={isDark ? "text-blue-400" : "text-blue-600"}>
            Kebijakan Privasi
          </Text>{" "}
          kami
        </Text>
      </View>

      {/* Bottom Decoration */}
      <View className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <LinearGradient
          colors={
            isDark ? ["transparent", "#1e40af"] : ["transparent", "#3b82f6"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          className="flex-1"
        />
      </View>
    </SafeAreaView>
  );
}
